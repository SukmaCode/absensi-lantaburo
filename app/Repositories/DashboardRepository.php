<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class DashboardRepository
{
    public function countStudents(): int
    {
        return Student::count();
    }

    public function countClasses(): int
    {
        return SchoolClass::count();
    }

    /**
     * @return array<string, int>
     */
    public function todayStudentAttendanceCounts(): array
    {
        return AttendanceStudent::query()
            ->whereDate('date', today())
            ->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    public function countStudentsAttendedToday(): int
    {
        return AttendanceStudent::query()
            ->whereDate('date', today())
            ->distinct()
            ->count('student_id');
    }

    public function recentStudentAttendance(): Collection
    {
        return AttendanceStudent::query()
            ->with('student.user:id,name')
            ->whereDate('date', today())
            ->orderByDesc('check_in_time')
            ->take(5)
            ->get();
    }

    public function recentTeacherAttendance(): Collection
    {
        return AttendanceTeacher::query()
            ->with('teacher.user:id,name')
            ->whereDate('date', today())
            ->orderByDesc('check_in_time')
            ->take(5)
            ->get();
    }

    public function recentAnnouncements(): Collection
    {
        return Announcement::query()
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->take(3)
            ->get();
    }

    public function recentStudents(): Collection
    {
        return Student::query()
            ->with(['user:id,name,status, photo', 'schoolClass:id,name'])
            ->latest()
            ->take(5)
            ->get();
    }

    /**
     * @return array<string, int>
     */
    public function weeklyPresentCounts(Carbon $start, Carbon $end): array
    {
        return AttendanceStudent::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->whereIn('status', ['hadir', 'terlambat'])
            ->toBase()
            ->selectRaw('date, count(*) as total')
            ->groupBy('date')
            ->pluck('total', 'date')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    // public function dateString(): string
    // {
    //     return AttendanceStudent::query()
    //         ->whereDate('date')
    //         ->toBase()
    //         ->get();
    // }
}
