<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class SiswaRepository
{
    public function todayStudentAttendance(int $studentId): ?AttendanceStudent
    {
        return AttendanceStudent::query()
            ->where('student_id', $studentId)
            ->whereDate('date', today())
            ->first();
    }

    /**
     * @param  array{photo_selfie: string}  $data
     */
    public function saveStudentSelfie(Student $student, array $data): AttendanceStudent
    {
        return AttendanceStudent::updateOrCreate(
            [
                'student_id' => $student->id,
                'date' => today()->toDateString(),
            ],
            [
                'photo_selfie' => $data['photo_selfie'],
                'check_in_time' => Carbon::now()->format('H:i:s'),
            ]
        );
    }

    /**
     * @return Collection<int, AttendanceStudent>
     */
    public function getMonthlyAttendance(int $studentId, Carbon $start, Carbon $end): Collection
    {
        return AttendanceStudent::query()
            ->where('student_id', $studentId)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->whereNotNull('status')
            ->orderByDesc('date')
            ->get();
    }

    /**
     * @return Collection<int, AttendanceStudent>
     */
    public function getRecentAttendanceHistory(int $studentId, int $limit = 7): Collection
    {
        return AttendanceStudent::query()
            ->where('student_id', $studentId)
            ->whereNotNull('status')
            ->orderByDesc('date')
            ->take($limit)
            ->get();
    }

    /**
     * @return Collection<int, Announcement>
     */
    public function recentAnnouncementsForStudent(): Collection
    {
        return Announcement::query()
            ->whereIn('target_role', ['all', 'siswa'])
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->take(5)
            ->get();
    }

    /**
     * @return array<string, int>
     */
    public function getMonthlyAttendanceCounts(int $studentId, Carbon $start, Carbon $end): array
    {
        return AttendanceStudent::query()
            ->where('student_id', $studentId)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->whereNotNull('status')
            ->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($total) => (int) $total)
            ->all();
    }
}
