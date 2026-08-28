<?php

namespace App\Http\Controllers\Guru;

use App\Exports\AttendanceStudentExport;
use App\Http\Controllers\Controller;
use App\Models\SchoolProfile;
use App\Models\Teacher;
use App\Models\User;
use App\Services\RekapMuridService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AttendanceStudentExportController extends Controller
{
    public function export(Request $request, RekapMuridService $service): BinaryFileResponse|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

        $month = $request->query('month');
        $recapData = $service->getMonthlyRecap($teacher, is_string($month) ? $month : null);

        if (! $recapData['hasHomeroomClass'] || ! $recapData['classInfo']) {
            return redirect()->route('guru.rekap-murid')->with('error', 'Anda belum ditugaskan sebagai wali kelas.');
        }

        $schoolProfile = SchoolProfile::first();
        $schoolName = $schoolProfile?->name ?? 'PONDOK PESANTREN LAN TABURO';

        $className = str_replace(['/', '\\', ' '], '-', (string) ($recapData['classInfo']['name'] ?? 'kelas'));
        $selectedMonth = (string) ($recapData['selectedMonth'] ?? now()->format('Y-m'));
        $fileName = "rekap-presensi-kelas-{$className}-{$selectedMonth}.xlsx";

        return Excel::download(
            new AttendanceStudentExport(
                recapData: $recapData,
                schoolName: $schoolName,
                teacherName: $user->name
            ),
            $fileName
        );
    }
}
