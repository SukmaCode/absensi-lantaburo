<?php

namespace App\Http\Controllers\CalonSiswa;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CalonSiswaDashboardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard for prospective students (calon siswa).
     */
    public function __invoke(Request $request, CalonSiswaDashboardService $service): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (in_array($user->role, ['siswa', 'student'], true)) {
            return redirect()->route('siswa.dashboard');
        }

        if (in_array($user->role, ['guru', 'teacher'], true)) {
            return redirect()->route('guru.dashboard');
        }

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $data = $service->getDashboardData($user);

        return Inertia::render('calon-siswa/dashboard', $data);
    }
}
