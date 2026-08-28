<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\ParentProfile;
use App\Models\Student;
use App\Repositories\OrangTuaRepository;
use Carbon\CarbonInterface;
use Illuminate\Support\Carbon;

class OrangTuaDashboardService
{
    public function __construct(private readonly OrangTuaRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getDashboardData(ParentProfile $parentProfile): array
    {
        $students = $parentProfile->students()->with(['user', 'schoolClass.homeroomTeacher.user'])->get();

        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd = Carbon::now()->endOfMonth();

        $childrenData = $students->map(function (Student $student) use ($monthStart, $monthEnd) {
            $todayRecord = $this->repository->todayStudentAttendance($student->id);
            $counts = $this->repository->getMonthlyAttendanceCounts($student->id, $monthStart, $monthEnd);

            $totalRecorded = array_sum($counts);
            $hadirCount = ($counts['hadir'] ?? 0) + ($counts['terlambat'] ?? 0);
            $attendanceRate = $totalRecorded > 0 ? (int) round($hadirCount / $totalRecorded * 100) : 0;

            $recentHistory = $this->repository->getRecentAttendanceHistory($student->id, 5)
                ->map(fn ($record) => [
                    'date' => Carbon::parse($record->date)->translatedFormat('d M Y'),
                    'dayName' => Carbon::parse($record->date)->translatedFormat('l'),
                    'status' => $record->status,
                    'statusLabel' => $this->statusLabel($record->status ?? 'hadir'),
                    'checkInTime' => $this->formatTime($record->check_in_time),
                    'notes' => $record->notes,
                    'photoUrl' => $record->photo_selfie ? asset('storage/'.$record->photo_selfie) : null,
                ])
                ->all();

            return [
                'id' => $student->id,
                'name' => $student->user->name,
                'nis' => $student->nis ?? '-',
                'className' => $student->schoolClass?->name ?? '-',
                'gradeLevel' => $student->schoolClass?->grade_level ?? '-',
                'homeroomTeacher' => $student->schoolClass?->homeroomTeacher?->user?->name ?? '-',
                'todayAttendance' => $todayRecord ? [
                    'hasAttended' => true,
                    'status' => $todayRecord->status,
                    'statusLabel' => $todayRecord->status ? $this->statusLabel($todayRecord->status) : null,
                    'checkInTime' => $this->formatTime($todayRecord->check_in_time),
                    'photoUrl' => $todayRecord->photo_selfie ? asset('storage/'.$todayRecord->photo_selfie) : null,
                    'notes' => $todayRecord->notes,
                ] : [
                    'hasAttended' => false,
                ],
                'monthlyStats' => [
                    'hadir' => $counts['hadir'] ?? 0,
                    'terlambat' => $counts['terlambat'] ?? 0,
                    'izin' => $counts['izin'] ?? 0,
                    'sakit' => $counts['sakit'] ?? 0,
                    'alpha' => $counts['alpha'] ?? 0,
                    'attendanceRate' => $attendanceRate,
                    'month' => Carbon::now()->translatedFormat('F Y'),
                ],
                'recentHistory' => $recentHistory,
            ];
        })->all();

        $announcements = $this->repository->recentAnnouncementsForParent()
            ->map(fn (Announcement $announcement) => [
                'title' => $announcement->title,
                'description' => $announcement->content,
                'date' => $this->relativeDate($announcement->published_at),
                'category' => match ($announcement->target_role) {
                    'guru' => 'Guru',
                    'siswa' => 'Siswa',
                    'orang_tua' => 'Orang Tua',
                    default => 'Umum',
                },
            ])
            ->all();

        return [
            'children' => $childrenData,
            'hasChildren' => count($childrenData) > 0,
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
