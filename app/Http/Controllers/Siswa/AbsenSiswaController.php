<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Siswa\StoreStudentAttendanceRequest;
use App\Models\Student;
use App\Models\User;
use App\Services\AbsenSiswaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsenSiswaController extends Controller
{
    public function __invoke(Request $request, AbsenSiswaService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $student = $user->student ?? Student::firstOrCreate(['user_id' => $user->id]);

        return Inertia::render('siswa/absen', $service->getAttendancePageData($student));
    }

    public function store(StoreStudentAttendanceRequest $request, AbsenSiswaService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $student = $user->student ?? Student::firstOrCreate(['user_id' => $user->id]);

        $service->storeAttendance($student, $request->validated());

        return back()->with('success', 'Foto selfie berhasil dikirim. Status kehadiran akan dikonfirmasi oleh guru wali kelas.');
    }
}
