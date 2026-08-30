<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\ParentProfile;
use App\Models\PaymentSpp;
use App\Models\User;
use App\Services\MidtransService;
use App\Services\SppPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SppPaymentController extends Controller
{
    /**
     * Display the SPP payment page.
     */
    public function __invoke(Request $request, SppPaymentService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $parentProfile = $user->parentProfile ?? ParentProfile::firstOrCreate(['user_id' => $user->id]);

        $studentId = $request->query('student_id');

        return Inertia::render('orangtua/spp-payment', $service->getPageData(
            $parentProfile,
            $studentId ? (int) $studentId : null
        ));
    }

    /**
     * Get or create a Snap Token for SPP payment.
     */
    public function getSnapToken(Request $request, SppPaymentService $service, MidtransService $midtransService): JsonResponse
    {
        $request->validate([
            'student_id' => ['required', 'integer'],
            'month' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $parentProfile = $user->parentProfile;

        if (! $parentProfile) {
            return response()->json(['message' => 'Profil orang tua tidak ditemukan.'], 403);
        }

        // Pastikan siswa adalah anak dari orang tua ini
        $student = $parentProfile->students()->with(['user', 'sppSetting'])->find($request->integer('student_id'));

        if (! $student) {
            return response()->json(['message' => 'Data siswa tidak ditemukan.'], 404);
        }

        if (! $student->sppSetting) {
            return response()->json([
                'message' => 'Nominal SPP untuk siswa ini belum diatur. Hubungi admin sekolah.',
            ], 422);
        }

        $result = $service->getOrCreateSnapToken(
            $user,
            $student,
            $request->string('month')->toString(),
            $midtransService
        );

        if (! $result['success']) {
            return response()->json([
                'message' => $result['message'],
                'status' => $result['status'] ?? null,
            ], $result['status_code'] ?? 400);
        }

        return response()->json($result['data']);
    }

    /**
     * Cek dan sync payment status dari Midtrans.
     */
    public function checkStatus(Request $request, SppPaymentService $service, MidtransService $midtransService): JsonResponse
    {
        $request->validate([
            'order_id' => ['required', 'string'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $parentProfile = $user->parentProfile;

        if (! $parentProfile) {
            return response()->json(['message' => 'Profil orang tua tidak ditemukan.'], 403);
        }

        $orderId = $request->string('order_id')->toString();

        // Verifikasi bahwa order_id milik salah satu anak dari orang tua ini
        $studentIds = $parentProfile->students()->pluck('id');
        $sppPaymentExists = PaymentSpp::where('order_id', $orderId)
            ->whereIn('student_id', $studentIds)
            ->exists();

        if (! $sppPaymentExists) {
            return response()->json(['message' => 'Transaksi tidak ditemukan.'], 404);
        }

        $result = $service->checkPaymentStatus($orderId, $midtransService);

        return response()->json($result);
    }
}
