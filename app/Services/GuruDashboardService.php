<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\Teacher;
use App\Repositories\GuruRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class GuruDashboardService
{
    public function __construct(private readonly GuruRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getDashboardData(Teacher $teacher): array
    {
        $todayAttendance = $this->repository->todayTeacherAttendance($teacher->id);
        $homeroomClass = $this->repository->getHomeroomClass($teacher->id);

        $studentSummary = null;
        if ($homeroomClass) {
            $totalStudents = $homeroomClass->students_count;
            $counts = $this->repository->todayHomeroomStudentAttendanceCounts($homeroomClass->id);
            $attendedCount = $this->repository->countHomeroomStudentsAttendedToday($homeroomClass->id);
            $hadir = $counts['hadir'] ?? 0;
            $terlambat = $counts['terlambat'] ?? 0;

            $studentSummary = [
                'totalStudents' => $totalStudents,
                'hadir' => $hadir,
                'terlambat' => $terlambat,
                'izin' => $counts['izin'] ?? 0,
                'sakit' => $counts['sakit'] ?? 0,
                'alpha' => $counts['alpha'] ?? 0,
                'belumAbsen' => max(0, $totalStudents - $attendedCount),
                'attendanceRate' => $totalStudents > 0 ? (int) round(($hadir + $terlambat) / $totalStudents * 100) : 0,
            ];
        }

        $announcements = $this->repository->recentAnnouncementsForTeacher()
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

        return [
            'teacherInfo' => [
                'nip' => $teacher->nip ?? '-',
                'subject' => $teacher->subject ?? '-',
            ],
            'todaySelfAttendance' => $todayAttendance ? [
                'hasAttended' => true,
                'checkInTime' => $this->formatTime($todayAttendance->check_in_time),
                'status' => $this->statusLabel($todayAttendance->status),
                'rawStatus' => $todayAttendance->status,
                'photoUrl' => $todayAttendance->photo_selfie ? asset('storage/'.$todayAttendance->photo_selfie) : null,
                'latitude' => $todayAttendance->latitude,
                'longitude' => $todayAttendance->longitude,
                'notes' => $todayAttendance->notes,
            ] : [
                'hasAttended' => false,
            ],
            'homeroomClass' => $homeroomClass ? [
                'id' => $homeroomClass->id,
                'name' => $homeroomClass->name,
                'gradeLevel' => $homeroomClass->grade_level,
                'totalStudents' => $homeroomClass->students_count,
            ] : null,
            'studentSummary' => $studentSummary,
            'announcements' => $announcements,
        ];
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
