<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use Exception;
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

        if ($paymentStatus === 'success' && ! $payment->settlement_time) {
            $payment->settlement_time = now();
            if ($payment->user) {
                $payment->user->update(['status' => 'active']);
            }
        }

        $payment->save();

        return $payment;
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

            if ($paymentStatus === 'success' && ! $payment->settlement_time) {
                $payment->settlement_time = now();
                if ($payment->user) {
                    $payment->user->update(['status' => 'active']);
                }
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
