<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(NotificationService $service): JsonResponse
    {
        $notifications = $service->paidRegistrationNotifications();

        return response()->json([
            'notifications' => $notifications,
            'count' => count($notifications),
        ]);
    }
}
