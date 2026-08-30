<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\PaymentSpp;
use App\Models\SppSetting;
use App\Models\Student;
use App\Models\User;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        $this->configure();
    }

    /**
     * Set configuration for Midtrans.
     */
    public function configure(): void
    {
        Config::$serverKey = (string) config('midtrans.server_key');
        Config::$clientKey = (string) config('midtrans.client_key');
        Config::$isProduction = (bool) config('midtrans.is_production', false);
        Config::$isSanitized = (bool) config('midtrans.is_sanitized', true);
        Config::$is3ds = (bool) config('midtrans.is_3ds', true);
    }

    /**
     * Create Snap Token for registration payment.
     */
    public function createSnapToken(
        User $user,
        int $amount,
        string $orderId,
        string $itemName = 'Biaya Pendaftaran Akun'
    ): ?string {
        $this->configure();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $amount,
            ],
            'item_details' => [
                [
                    'id' => 'REG-FEE',
                    'price' => $amount,
                    'quantity' => 1,
                    'name' => mb_substr($itemName, 0, 50),
                ],
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '081234567890',
            ],
        ];

        try {
            return Snap::getSnapToken($params);
        } catch (Exception $e) {
            Log::error('Midtrans Snap Token generation error: '.$e->getMessage(), [
                'user_id' => $user->id,
                'order_id' => $orderId,
            ]);

            return null;
        }
    }

    /**
     * Create Snap Token for SPP payment.
     */
    public function createSppSnapToken(
        User $parentUser,
        Student $student,
        int $amount,
        string $orderId,
        string $month
    ): ?string {
        $this->configure();

        $monthLabel = Carbon::createFromFormat('Y-m', $month)->translatedFormat('F Y');

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $amount,
            ],
            'item_details' => [
                [
                    'id' => 'SPP-'.$month,
                    'price' => $amount,
                    'quantity' => 1,
                    'name' => mb_substr('SPP '.$monthLabel.' - '.($student->user->name ?? 'Siswa'), 0, 50),
                ],
            ],
            'customer_details' => [
                'first_name' => $parentUser->name,
                'email' => $parentUser->email,
                'phone' => $parentUser->phone ?? '081234567890',
            ],
        ];

        try {
            return Snap::getSnapToken($params);
        } catch (Exception $e) {
            Log::error('Midtrans SPP Snap Token error: '.$e->getMessage(), [
                'student_id' => $student->id,
                'order_id' => $orderId,
                'month' => $month,
            ]);

            return null;
        }
    }

    /**
     * Verify Midtrans notification signature key.
     */
    public function verifySignature(
        string $orderId,
        string $statusCode,
        string $grossAmount,
        string $signatureKey
    ): bool {
        $serverKey = (string) config('midtrans.server_key');
        $input = $orderId.$statusCode.$grossAmount.$serverKey;
        $expectedSignature = hash('sha512', $input);

        return hash_equals($expectedSignature, $signatureKey);
    }

    /**
     * Handle incoming notification webhook payload from Midtrans.
     *
     * @param  array<string, mixed>  $payload
     */
    public function handleWebhookNotification(array $payload): ?Payment
    {
        $orderId = (string) ($payload['order_id'] ?? '');
        $statusCode = (string) ($payload['status_code'] ?? '');
        $grossAmount = (string) ($payload['gross_amount'] ?? '');
        $signatureKey = (string) ($payload['signature_key'] ?? '');
        $transactionStatus = (string) ($payload['transaction_status'] ?? '');
        $fraudStatus = (string) ($payload['fraud_status'] ?? '');
        $paymentType = (string) ($payload['payment_type'] ?? null);

        if (! $this->verifySignature($orderId, $statusCode, $grossAmount, $signatureKey)) {
            Log::warning('Midtrans Webhook: Invalid signature', ['order_id' => $orderId]);

            return null;
        }

        // Route SPP payments to payment_spp table (tidak mengubah role user)
        if (str_starts_with($orderId, 'SPP-')) {
            $this->handleSppWebhook($orderId, $transactionStatus, $fraudStatus, $paymentType, $payload);

            return null; // Webhook tetap return null; MidtransWebhookController hanya perlu tahu sukses
        }

        $payment = Payment::where('order_id', $orderId)->first();

        if (! $payment) {
            Log::warning('Midtrans Webhook: Payment not found', ['order_id' => $orderId]);

            return null;
        }

        $paymentStatus = match ($transactionStatus) {
            'capture' => ($fraudStatus === 'challenge') ? 'challenge' : 'success',
            'settlement' => 'success',
            'pending' => 'pending',
            'deny' => 'failed',
            'expire' => 'expired',
            'cancel' => 'cancelled',
            default => $payment->status,
        };

        $payment->status = $paymentStatus;
        $payment->payment_type = $paymentType ?: $payment->payment_type;
        $payment->raw_response = $payload;

        if ($paymentStatus === 'success') {
            $this->fulfillRegistrationSuccess($payment);
        }

        $payment->save();

        return $payment;
    }

    /**
     * Fulfill registration payment: activate user, create student record & default SPP setting.
     */
    private function fulfillRegistrationSuccess(Payment $payment): void
    {
        if (! $payment->settlement_time) {
            $payment->settlement_time = now();
        }

        if ($payment->user) {
            $payment->user->update([
                'role' => 'siswa',
                'status' => 'active',
            ]);
        }

        $student = Student::firstOrCreate(
            ['user_id' => $payment->user_id],
            [
                'nis' => '421'.date('Y').str_pad((string) $payment->user_id, 4, '0', STR_PAD_LEFT),
                'gender' => 'L',
            ]
        );

        if ($student) {
            SppSetting::firstOrCreate(
                ['student_id' => $student->id],
                ['amount' => 100000]
            );
        }
    }

    /**
     * Handle SPP-specific webhook notification (tidak mengubah role user).
     *
     * @param  array<string, mixed>  $payload
     */
    private function handleSppWebhook(
        string $orderId,
        string $transactionStatus,
        string $fraudStatus,
        string $paymentType,
        array $payload
    ): void {
        $sppPayment = PaymentSpp::where('order_id', $orderId)->first();

        if (! $sppPayment) {
            Log::warning('Midtrans Webhook: SPP Payment not found', ['order_id' => $orderId]);

            return;
        }

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
        $sppPayment->raw_response = $payload;

        if ($paymentStatus === 'success' && ! $sppPayment->settlement_time) {
            $sppPayment->settlement_time = now();
        }

        $sppPayment->save();

        Log::info('SPP Payment webhook processed', [
            'order_id' => $orderId,
            'status' => $paymentStatus,
        ]);
    }

    /**
     * Check transaction status directly via Midtrans API.
     *
     * @return array{success: bool, status: string, payment: ?Payment, message: string}
     */
    public function checkTransactionStatus(string $orderId): array
    {
        $this->configure();

        $payment = Payment::where('order_id', $orderId)->first();

        if (! $payment) {
            return [
                'success' => false,
                'status' => 'not_found',
                'payment' => null,
                'message' => 'Transaksi tidak ditemukan.',
            ];
        }

        try {
            /** @var object $statusResponse */
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
                default => $payment->status,
            };

            $payment->status = $paymentStatus;
            $payment->payment_type = $paymentType ?: $payment->payment_type;
            $payment->raw_response = $responseArray;

            if ($paymentStatus === 'success') {
                $this->fulfillRegistrationSuccess($payment);
            }

            $payment->save();

            return [
                'success' => true,
                'status' => $paymentStatus,
                'payment' => $payment,
                'message' => 'Status pembayaran berhasil diperbarui.',
            ];
        } catch (Exception $e) {
            Log::error('Error checking Midtrans transaction status: '.$e->getMessage(), [
                'order_id' => $orderId,
            ]);

            return [
                'success' => false,
                'status' => $payment->status,
                'payment' => $payment,
                'message' => 'Belum ada update pembayaran dari Midtrans.',
            ];
        }
    }
}
