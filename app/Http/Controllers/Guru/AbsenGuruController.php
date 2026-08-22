<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guru\StoreTeacherAttendanceRequest;
use App\Models\Teacher;
use App\Models\User;
use App\Services\AbsenGuruService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsenGuruController extends Controller
{
    public function __invoke(Request $request, AbsenGuruService $service): Response
    {
        /** @var User $user */
        $user = $request->user();
        $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

        return Inertia::render('guru/absen', $service->getAttendancePageData($teacher));
    }

    public function store(StoreTeacherAttendanceRequest $request, AbsenGuruService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

        $service->storeAttendance($teacher, $request->validated());

        return back()->with('success', 'Absensi berhasil dicatat.');
    }
}
