<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use App\Services\GuruDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, GuruDashboardService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

        return Inertia::render('guru/dashboard', $service->getDashboardData($teacher));
    }
}
