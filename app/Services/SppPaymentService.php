<?php

namespace App\Services;

use App\Models\ParentProfile;
use App\Models\PaymentSpp;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Carbon;
use Midtrans\Transaction;

class SppPaymentService
{
    /**
     * Get all data needed for the SPP payment page.
     *
     * @return array<string, mixed>
     */
    public function getPageData(ParentProfile $parentProfile, ?int $studentId = null): array
    {
        $students = $parentProfile->students()->with(['user', 'sppSetting', 'schoolClass'])->get();

        if ($students->isEmpty()) {
            return [
                'hasChildren' => false,
                'children' => [],
                'selectedStudent' => null,
                'sppHistory' => [],
                'hasSppSetting' => false,
                'sppAmount' => null,
            ];
        }

        $selectedStudent = $studentId
            ? $students->firstWhere('id', $studentId) ?? $students->first()
            : $students->first();

        $sppHistory = $this->getSppHistory($selectedStudent);
        $hasSppSetting = $selectedStudent->sppSetting !== null;

        return [
            'hasChildren' => true,
            'children' => $students->map(fn (Student $s) => [
                'id' => $s->id,
                'name' => $s->user->name ?? '-',
                'nis' => $s->nis ?? '-',
                'className' => $s->schoolClass?->name ?? '-',
            ])->values()->all(),
            'selectedStudent' => [
                'id' => $selectedStudent->id,
                'name' => $selectedStudent->user?->name ?? '-',
                'nis' => $selectedStudent->nis ?? '-',
                'className' => $selectedStudent->schoolClass?->name ?? '-',
            ],
            'sppHistory' => $sppHistory,
            'hasSppSetting' => $hasSppSetting,
            'sppAmount' => $hasSppSetting ? $selectedStudent->sppSetting->amount : null,
        ];
    }

    /**
     * Get or create a pending SPP PaymentSpp record for a student + month.
     */
    public function getOrCreatePendingPayment(Student $student, string $month): PaymentSpp
    {
        $existing = PaymentSpp::where('student_id', $student->id)
            ->where('month', $month)
            ->first();

        if ($existing) {
            return $existing;
        }

        $amount = $student->sppSetting?->amount ?? 0;
        $orderId = 'SPP-S'.$student->id.'-'.$month.'-'.time();

        return PaymentSpp::create([
            'student_id' => $student->id,
            'order_id' => $orderId,
            'amount' => $amount,
            'month' => $month,
            'status' => 'pending',
        ]);
    }

    /**
     * Get SPP payment history for a student starting from the student registration month up to the current month.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getSppHistory(Student $student): array
    {
        $payments = PaymentSpp::where('student_id', $student->id)
            ->orderByDesc('month')
            ->get()
            ->keyBy('month');

        $registeredAt = $student->created_at ?? $student->user?->created_at ?? Carbon::now();
        $startMonth = $registeredAt->copy()->startOfMonth();
        $endMonth = Carbon::now()->startOfMonth();

        // If there are earlier recorded payments, include them
        $earliestPaymentMonth = $payments->keys()->min();
        if ($earliestPaymentMonth) {
            $earliestPaymentDate = Carbon::createFromFormat('Y-m', $earliestPaymentMonth)->startOfMonth();
            if ($earliestPaymentDate->lessThan($startMonth)) {
                $startMonth = $earliestPaymentDate;
            }
        }

        // If there are payments in advance (after current month), extend endMonth
        $latestPaymentMonth = $payments->keys()->max();
        if ($latestPaymentMonth) {
            $latestPaymentDate = Carbon::createFromFormat('Y-m', $latestPaymentMonth)->startOfMonth();
            if ($latestPaymentDate->greaterThan($endMonth)) {
                $endMonth = $latestPaymentDate;
            }
        }

        if ($startMonth->greaterThan($endMonth)) {
            $startMonth = $endMonth->copy();
        }

        $months = [];
        $cursor = $endMonth->copy();

        while ($cursor->greaterThanOrEqualTo($startMonth)) {
            $monthKey = $cursor->format('Y-m');
            $payment = $payments->get($monthKey);

            $months[] = [
                'month' => $monthKey,
                'monthLabel' => $cursor->translatedFormat('F Y'),
                'status' => $payment?->status ?? 'unpaid',
                'isPaid' => $payment?->isPaid() ?? false,
                'isPending' => $payment?->isPending() ?? false,
                'orderId' => $payment?->order_id,
                'amount' => $payment?->amount,
                'paidAt' => $payment?->settlement_time?->translatedFormat('d M Y'),
                'paymentType' => $payment?->payment_type,
            ];

            $cursor->subMonth();
        }

        return $months;
    }

    /**
     * Check and sync SPP payment status from Midtrans API.
     *
     * @return array<string, mixed>
     */
    public function checkPaymentStatus(string $orderId, MidtransService $midtransService): array
    {
        $midtransService->configure();

        $sppPayment = PaymentSpp::where('order_id', $orderId)->first();

        if (! $sppPayment) {
            return [
                'success' => false,
                'status' => 'not_found',
                'message' => 'Transaksi tidak ditemukan.',
            ];
        }

        try {
            $statusResponse = Transaction::status($orderId);
            $responseArray = json_decode((string) json_encode($statusResponse), true);

            $transactionStatus = $responseArray['transaction_status'] ?? '';
            $fraudStatus = $responseArray['fraud_status'] ?? '';
            $paymentType = $responseArray['payment_type'] ?? null;

            $paymentStatus = match ($transactionStatus) {
                'capture' => ($fraudStatus === 'challenge') ? 'challenge' : 'success',
                'settlement' => 'success',
                'pending' => 'pending',
                'deny' => 'failed',
                'expire' => 'expired',
                'cancel' => 'cancelled',
                default => $sppPayment->status,
            };

            $sppPayment->status = $paymentStatus;
            $sppPayment->payment_type = $paymentType ?: $sppPayment->payment_type;
            $sppPayment->raw_response = $responseArray;

            if ($paymentStatus === 'success' && ! $sppPayment->settlement_time) {
                $sppPayment->settlement_time = now();
            }

            $sppPayment->save();

            return [
                'success' => true,
                'status' => $paymentStatus,
                'isPaid' => $sppPayment->fresh()->isPaid(),
                'message' => 'Status pembayaran SPP berhasil diperbarui.',
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'status' => $sppPayment->status,
                'isPaid' => $sppPayment->isPaid(),
                'message' => 'Belum ada update pembayaran dari Midtrans.',
            ];
        }
    }

    /**
     * Get or create a Snap Token for SPP payment.
     *
     * @return array{
     *     success: bool,
     *     status_code?: int,
     *     message?: string,
     *     status?: string,
     *     data?: array{
     *         order_id: string,
     *         amount: mixed,
     *         snap_token: ?string,
     *         status: string
     *     }
     * }
     */
    public function getOrCreateSnapToken(
        User $user,
        Student $student,
        string $month,
        MidtransService $midtransService
    ): array {
        $sppPayment = $this->getOrCreatePendingPayment($student, $month);

        if ($sppPayment->isPaid()) {
            return [
                'success' => false,
                'status_code' => 422,
                'message' => 'SPP bulan ini sudah lunas.',
                'status' => $sppPayment->status,
            ];
        }

        if (! $sppPayment->snap_token || $sppPayment->status === 'expired') {
            $snapToken = $midtransService->createSppSnapToken(
                $user,
                $student,
                (int) $sppPayment->amount,
                $sppPayment->order_id,
                $month
            );

            if (! $snapToken) {
                return [
                    'success' => false,
                    'status_code' => 500,
                    'message' => 'Gagal membuat sesi pembayaran Midtrans. Silakan coba beberapa saat lagi.',
                    'status' => $sppPayment->status,
                ];
            }

            $sppPayment->snap_token = $snapToken;
            if ($sppPayment->status === 'expired') {
                $sppPayment->status = 'pending';
            }
            $sppPayment->save();
        }

        return [
            'success' => true,
            'data' => [
                'order_id' => $sppPayment->order_id,
                'amount' => $sppPayment->amount,
                'snap_token' => $sppPayment->snap_token,
                'status' => $sppPayment->status,
            ],
        ];
    }
}
