<?php

namespace App\Services;

use App\Models\SchoolProfile;
use App\Models\User;

class CalonSiswaDashboardService
{
    /**
     * @return array<string, mixed>
     */
    public function getDashboardData(User $user): array
    {
        $student = $user->student;
        $registrationPayment = $user->registrationPayment ?? $user->latestPayment;
        $schoolProfile = SchoolProfile::first();

        $registrationFee = (int) config('midtrans.registration_fee', 150000);

        $paymentData = $registrationPayment ? [
            'orderId' => $registrationPayment->order_id,
            'amount' => (int) $registrationPayment->amount,
            'formattedAmount' => 'Rp '.number_format($registrationPayment->amount, 0, ',', '.'),
            'status' => $registrationPayment->status,
            'isPaid' => $registrationPayment->isPaid(),
            'isPending' => $registrationPayment->isPending(),
            'paymentType' => $registrationPayment->payment_type,
            'snapToken' => $registrationPayment->snap_token,
            'createdAt' => $registrationPayment->created_at?->translatedFormat('d M Y, H:i'),
            'settlementTime' => $registrationPayment->settlement_time?->translatedFormat('d M Y, H:i'),
        ] : null;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'createdAt' => $user->created_at?->translatedFormat('d M Y, H:i') ?? '-',
            ],
            'studentInfo' => [
                'nis' => $student?->nis ?? '-',
                'gender' => $student?->gender ?? 'L',
            ],
            'registrationPayment' => $paymentData,
            'registrationFee' => $registrationFee,
            'formattedRegistrationFee' => 'Rp '.number_format($registrationFee, 0, ',', '.'),
            'schoolContact' => [
                'name' => $schoolProfile?->name ?? 'Homeschooling Lantaburo',
                'phone' => $schoolProfile?->phone ?? '0812-3456-7890',
                'email' => $schoolProfile?->email ?? 'info@lantaburo.sch.id',
                'address' => $schoolProfile?->address ?? 'Jl. Raya Lantaburo',
            ],
            'autoOpenSnap' => (bool) session('auto_open_snap', false),
        ];
    }
}
