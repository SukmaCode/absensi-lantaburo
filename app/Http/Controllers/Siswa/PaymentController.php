<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Get or refresh Snap Token for registration payment.
     */
    public function getSnapToken(Request $request, MidtransService $midtransService): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $payment = $user->registrationPayment ?? $user->latestPayment;

        if (! $payment) {
            $amount = (int) config('midtrans.registration_fee', 150000);
            $orderId = 'REG-U'.$user->id.'-'.time();

            $payment = Payment::create([
                'user_id' => $user->id,
                'order_id' => $orderId,
                'amount' => $amount,
                'type' => 'registration',
                'status' => 'pending',
            ]);
        }

        if (! $payment->snap_token || $payment->status === 'expired') {
            $snapToken = $midtransService->createSnapToken($user, (int) $payment->amount, $payment->order_id);
            if ($snapToken) {
                $payment->snap_token = $snapToken;
                if ($payment->status === 'expired') {
                    $payment->status = 'pending';
                }
                $payment->save();
            }
        }

        return response()->json([
            'order_id' => $payment->order_id,
            'amount' => $payment->amount,
            'snap_token' => $payment->snap_token,
            'status' => $payment->status,
        ]);
    }

    /**
     * Sync and check payment status directly with Midtrans.
     */
    public function checkStatus(Request $request, MidtransService $midtransService): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $orderId = $request->input('order_id');
        $payment = $orderId
            ? Payment::where('order_id', $orderId)->where('user_id', $user->id)->first()
            : ($user->registrationPayment ?? $user->latestPayment);

        if (! $payment) {
            return response()->json([
                'success' => false,
                'message' => 'Data pembayaran tidak ditemukan.',
            ], 404);
        }

        $result = $midtransService->checkTransactionStatus($payment->order_id);

        return response()->json([
            'success' => $result['success'],
            'status' => $payment->fresh()->status,
            'is_paid' => $payment->fresh()->isPaid(),
            'message' => $result['message'],
        ]);
    }
}
