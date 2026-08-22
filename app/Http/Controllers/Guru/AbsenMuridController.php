<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guru\StoreBatchStudentAttendanceRequest;
use App\Models\Teacher;
use App\Models\User;
use App\Services\AbsenMuridService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsenMuridController extends Controller
{
    public function __invoke(Request $request, AbsenMuridService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

        $date = $request->query('date');

        return Inertia::render('guru/absen-murid', $service->getStudentAttendanceData($teacher, $date));
    }

    public function store(StoreBatchStudentAttendanceRequest $request, AbsenMuridService $service): RedirectResponse
    {
        $validated = $request->validated();
        $service->saveBatchAttendance($validated['date'], $validated['attendances']);

        return back()->with('success', 'Absensi murid berhasil disimpan.');
    }
}
