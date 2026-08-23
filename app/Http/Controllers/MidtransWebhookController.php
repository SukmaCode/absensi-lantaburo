<?php

namespace App\Http\Controllers;

use App\Services\MidtransService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransWebhookController extends Controller
{
    public function __invoke(Request $request, MidtransService $midtransService): JsonResponse
    {
        $payload = $request->all();

        $payment = $midtransService->handleWebhookNotification($payload);

        if (! $payment) {
            return response()->json([
                'status' => 'ignored',
                'message' => 'Notification not processed (invalid signature or payment not found)',
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Notification processed successfully',
            'order_id' => $payment->order_id,
            'payment_status' => $payment->status,
        ], 200);
    }
}
