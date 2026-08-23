<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Services\RiwayatSiswaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatSiswaController extends Controller
{
    public function __invoke(Request $request, RiwayatSiswaService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $student = $user->student ?? Student::firstOrCreate(['user_id' => $user->id]);

        $month = $request->query('month');

        return Inertia::render('siswa/riwayat', $service->getHistoryData($student, $month));
    }
}
