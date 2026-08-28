<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Models\ParentProfile;
use App\Models\User;
use App\Services\OrangTuaDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, OrangTuaDashboardService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $parentProfile = $user->parentProfile ?? ParentProfile::firstOrCreate(['user_id' => $user->id]);

        return Inertia::render('orangtua/dashboard', $service->getDashboardData($parentProfile));
    }
}
