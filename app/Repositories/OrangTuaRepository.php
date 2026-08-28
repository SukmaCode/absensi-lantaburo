<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class OrangTuaRepository
{
    public function todayStudentAttendance(int $studentId): ?AttendanceStudent
    {
        return AttendanceStudent::query()
            ->where('student_id', $studentId)
            ->whereDate('date', today())
            ->first();
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

    /**
     * @return Collection<int, AttendanceStudent>
     */
    public function getMonthlyAttendanceRecords(int $studentId, Carbon $start, Carbon $end): Collection
    {
        return AttendanceStudent::query()
            ->where('student_id', $studentId)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->whereNotNull('status')
            ->orderBy('date')
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
    public function recentAnnouncementsForParent(): Collection
    {
        return Announcement::query()
            ->whereIn('target_role', ['all', 'orang_tua'])
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->take(5)
            ->get();
    }
}
