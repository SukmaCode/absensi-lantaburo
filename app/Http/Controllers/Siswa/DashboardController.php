<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Services\SiswaDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, SiswaDashboardService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $student = $user->student ?? Student::firstOrCreate(['user_id' => $user->id]);

        $data = $service->getDashboardData($student);
        $data['autoOpenSnap'] = (bool) $request->session()->get('auto_open_snap', false);

        return Inertia::render('siswa/dashboard', $data);
    }
}
