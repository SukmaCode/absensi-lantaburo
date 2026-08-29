<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Student;
use Illuminate\Support\Collection;
use Illuminate\Support\Number;

class NotificationService
{
    /**
     * Get list of students who have completed registration payment.
     * These are users with role 'siswa' who have a paid registration payment.
     *
     * @return array<int, array{
     *   student_id: int,
     *   user_id: int,
     *   name: string,
     *   email: string,
     *   phone: string|null,
     *   nis: string,
     *   class: string|null,
     *   gender: string|null,
     *   birth_date: string|null,
     *   address: string|null,
     *   parent_name: string|null,
     *   parent_phone: string|null,
     *   payment: array{
     *     order_id: string,
     *     amount: int,
     *     formatted_amount: string,
     *     payment_type: string|null,
     *     status: string,
     *     settlement_time: string|null,
     *     created_at: string|null,
     *   },
     * }>
     */
    public function paidRegistrationNotifications(): array
    {
        /** @var Collection<int, Payment> $payments */
        $payments = Payment::query()
            ->with(['user.student.schoolClass'])
            ->where('type', 'registration')
            ->whereIn('status', ['success', 'settlement', 'capture'])
            ->whereHas('user', fn ($q) => $q->where('role', 'siswa'))
            ->orderByDesc('settlement_time')
            ->orderByDesc('created_at')
            ->get();

        return $payments->map(function (Payment $payment) {
            $user = $payment->user;
            /** @var Student|null $student */
            $student = $user?->student;

            return [
                'student_id' => $student?->id,
                'user_id' => $user?->id,
                'name' => $user?->name ?? '-',
                'email' => $user?->email ?? '-',
                'phone' => $user?->phone,
                'nis' => $student?->nis ?? '-',
                'class' => $student?->schoolClass?->name,
                'gender' => $student?->gender,
                'birth_date' => $student?->birth_date,
                'address' => $student?->address,
                'parent_name' => $student?->parent_name,
                'parent_phone' => $student?->parent_phone,
                'payment' => [
                    'order_id' => $payment->order_id,
                    'amount' => $payment->amount,
                    'formatted_amount' => 'Rp '.Number::format($payment->amount, locale: 'id'),
                    'payment_type' => $payment->payment_type,
                    'status' => $payment->status,
                    'settlement_time' => $payment->settlement_time?->toDateTimeString(),
                    'created_at' => $payment->created_at?->toDateTimeString(),
                ],
            ];
        })->values()->all();
    }
}
