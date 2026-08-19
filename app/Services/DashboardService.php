<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Models\Student;
use App\Repositories\DashboardRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class DashboardService
{
    public function __construct(private readonly DashboardRepository $repository) {}

    /**
     * @return array{
     *     attendanceSummary: array<string, int>,
     *     attendanceOverview: array<string, int>,
     *     recentAttendance: array<int, array<string, string>>,
     *     announcements: array<int, array<string, string>>,
     *     weeklyTrend: array<int, array<string, mixed>>,
     *     students: array<int, array<string, string|null>>
     * }
     */
    public function dashboardData(): array
    {
        return [
            'attendanceSummary' => $this->attendanceSummary(),
            'attendanceOverview' => $this->attendanceOverview(),
            'recentAttendance' => $this->recentAttendance(),
            'announcements' => $this->announcements(),
            'weeklyTrend' => $this->weeklyTrend(),
            'students' => $this->students(),
        ];
    }

    /**
     * @return array<string, int>
     */
    private function attendanceSummary(): array
    {
        $counts = $this->repository->todayStudentAttendanceCounts();
        $totalStudents = $this->repository->countStudents();
        $hadir = $counts['hadir'] ?? 0;

        return [
            'totalStudents' => $totalStudents,
            'totalClasses' => $this->repository->countClasses(),
            'hadir' => $hadir,
            'terlambat' => $counts['terlambat'] ?? 0,
            'belumAbsen' => max(0, $totalStudents - $this->repository->countStudentsAttendedToday()),
            'attendanceRate' => $totalStudents > 0 ? (int) round($hadir / $totalStudents * 100) : 0,
        ];
    }

    /**
     * @return array<string, int>
     */
    private function attendanceOverview(): array
    {
        $counts = $this->repository->todayStudentAttendanceCounts();
        $totalStudents = $this->repository->countStudents();

        return [
            'hadir' => $counts['hadir'] ?? 0,
            'terlambat' => $counts['terlambat'] ?? 0,
            'izin' => $counts['izin'] ?? 0,
            'sakit' => $counts['sakit'] ?? 0,
            'belumAbsen' => max(0, $totalStudents - $this->repository->countStudentsAttendedToday()),
            'alpha' => $counts['alpha'] ?? 0,
            'totalStudents' => $totalStudents,
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function recentAttendance(): array
    {
        return $this->repository->recentStudentAttendance()
            ->map(fn (AttendanceStudent $attendance) => [
                'name' => $attendance->student->user->name,
                'role' => 'Siswa',
                'status' => $this->statusLabel($attendance->status),
                'time' => $this->formatTime($attendance->check_in_time),
            ])
            ->concat(
                $this->repository->recentTeacherAttendance()->map(
                    fn (AttendanceTeacher $attendance) => [
                        'name' => $attendance->teacher->user->name,
                        'role' => 'Guru',
                        'status' => $this->statusLabel($attendance->status),
                        'time' => $this->formatTime($attendance->check_in_time),
                    ]
                )
            )
            ->filter(fn (array $record) => $record['status'] !== 'Tanpa Keterangan')
            ->sortByDesc('time')
            ->take(5)
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function announcements(): array
    {
        return $this->repository->recentAnnouncements()
            ->map(fn (Announcement $announcement) => [
                'title' => $announcement->title,
                'description' => $announcement->content,
                'date' => $this->relativeDate($announcement->published_at),
                'category' => match ($announcement->target_role) {
                    'guru' => 'Guru',
                    'siswa' => 'Siswa',
                    default => 'Umum',
                },
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function weeklyTrend(): array
    {
        $days = collect();
        $date = Carbon::today();

        while ($days->count() < 7) {
            if (! $date->isWeekend()) {
                $days->push($date->copy());
            }
            $date->subDay();
        }

        $days = $days->reverse()->values();
        $counts = $this->repository->weeklyPresentCounts($days->first(), $days->last());
        $labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

        return $days
            ->map(fn (Carbon $day) => [
                'day' => $labels[$day->dayOfWeekIso - 1],
                'value' => $counts[$day->toDateString()] ?? 0,
                'today' => $day->isToday(),
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    private function students(): array
    {
        return $this->repository->recentStudents()
            ->map(fn (Student $student) => [
                'name' => $student->user->name,
                'nis' => $student->nis,
                'class' => $student->schoolClass?->name,
                'status' => $student->user->status === 'active' ? 'Aktif' : 'Nonaktif',
                'avatar' => $student->user->photo,
            ])
            ->all();
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'hadir' => 'Hadir',
            'terlambat' => 'Terlambat',
            'izin' => 'Izin',
            'sakit' => 'Sakit',
            'alpha' => 'Tanpa Keterangan',
            default => ucfirst($status),
        };
    }

    private function formatTime(?string $time): string
    {
        return $time ? Carbon::createFromFormat('H:i:s', $time)->format('H:i') : '-';
    }

    private function relativeDate(?CarbonInterface $date): string
    {
        if (! $date) {
            return '';
        }

        $days = (int) $date->startOfDay()->diffInDays(today()->startOfDay());

        return match (true) {
            $days <= 0 => 'Hari ini',
            $days === 1 => 'Kemarin',
            default => "{$days} hari lalu",
        };
    }
}
