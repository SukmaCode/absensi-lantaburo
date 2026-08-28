<?php

namespace App\Services;

use App\Models\AttendanceStudent;
use App\Models\ParentProfile;
use App\Models\Student;
use App\Repositories\OrangTuaRepository;
use Illuminate\Support\Carbon;

class AbsenAnakService
{
    public function __construct(private readonly OrangTuaRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getAbsenData(ParentProfile $parentProfile, ?string $selectedMonth = null, ?int $selectedStudentId = null): array
    {
        $children = $parentProfile->students()->with('user')->get();

        if ($children->isEmpty()) {
            return [
                'hasChildren' => false,
                'children' => [],
                'selectedStudent' => null,
                'selectedMonth' => Carbon::now()->format('Y-m'),
                'monthLabel' => Carbon::now()->translatedFormat('F Y'),
                'daysInMonth' => [],
                'attendanceRecords' => [],
                'dailySummary' => [],
                'summary' => $this->emptySummary(),
            ];
        }

        // Default to first child if none selected
        $selectedStudent = $selectedStudentId
            ? $children->firstWhere('id', $selectedStudentId) ?? $children->first()
            : $children->first();

        // Normalize month
        $currentDate = $selectedMonth
            ? Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth()
            : Carbon::now()->startOfMonth();

        $startDate = $currentDate->copy()->startOfMonth();
        $endDate = $currentDate->copy()->endOfMonth();

        // Build days array
        $daysInMonth = [];
        $dayCursor = $startDate->copy();
        while ($dayCursor->lte($endDate)) {
            $daysInMonth[] = [
                'date' => $dayCursor->toDateString(),
                'dayNumber' => $dayCursor->format('d'),
                'dayName' => $dayCursor->translatedFormat('D'),
                'fullDayName' => $dayCursor->translatedFormat('l'),
                'isWeekend' => $dayCursor->isWeekend(),
                'isToday' => $dayCursor->isToday(),
            ];
            $dayCursor->addDay();
        }

        $records = $this->repository->getMonthlyAttendanceRecords($selectedStudent->id, $startDate, $endDate);

        $recordsByDate = $records->keyBy(fn (AttendanceStudent $att) => Carbon::parse($att->date)->toDateString());

        $hadirCount = 0;
        $terlambatCount = 0;
        $izinCount = 0;
        $sakitCount = 0;
        $alphaCount = 0;

        // Build per-day summary
        $dailySummary = collect($daysInMonth)->map(function (array $day) use ($recordsByDate, &$hadirCount, &$terlambatCount, &$izinCount, &$sakitCount, &$alphaCount) {
            $record = $recordsByDate->get($day['date']);

            if ($record) {
                match ($record->status) {
                    'hadir' => $hadirCount++,
                    'terlambat' => $terlambatCount++,
                    'izin' => $izinCount++,
                    'sakit' => $sakitCount++,
                    'alpha' => $alphaCount++,
                    default => null,
                };
            }

            return [
                'date' => $day['date'],
                'dayNumber' => $day['dayNumber'],
                'dayName' => $day['dayName'],
                'fullDayName' => $day['fullDayName'],
                'isWeekend' => $day['isWeekend'],
                'isToday' => $day['isToday'],
                'status' => $record?->status,
                'statusLabel' => $record?->status ? $this->statusLabel($record->status) : null,
                'checkInTime' => $record ? $this->formatTime($record->check_in_time) : null,
                'notes' => $record?->notes,
                'photoUrl' => $record?->photo_selfie ? asset('storage/'.$record->photo_selfie) : null,
            ];
        })->all();

        $totalRecorded = $hadirCount + $terlambatCount + $izinCount + $sakitCount + $alphaCount;
        $totalEffectivePresent = $hadirCount + $terlambatCount;

        return [
            'hasChildren' => true,
            'children' => $children->map(fn (Student $s) => [
                'id' => $s->id,
                'name' => $s->user->name,
                'nis' => $s->nis ?? '-',
            ])->all(),
            'selectedStudent' => [
                'id' => $selectedStudent->id,
                'name' => $selectedStudent->user->name,
                'nis' => $selectedStudent->nis ?? '-',
            ],
            'selectedMonth' => $currentDate->format('Y-m'),
            'monthLabel' => $currentDate->translatedFormat('F Y'),
            'daysInMonth' => $daysInMonth,
            'dailySummary' => $dailySummary,
            'summary' => [
                'hadir' => $hadirCount,
                'terlambat' => $terlambatCount,
                'izin' => $izinCount,
                'sakit' => $sakitCount,
                'alpha' => $alphaCount,
                'totalHadir' => $totalEffectivePresent,
                'attendancePercentage' => $totalRecorded > 0 ? (int) round(($totalEffectivePresent / $totalRecorded) * 100) : 0,
            ],
        ];
    }

    /**
     * @return array<string, int>
     */
    private function emptySummary(): array
    {
        return [
            'hadir' => 0,
            'terlambat' => 0,
            'izin' => 0,
            'sakit' => 0,
            'alpha' => 0,
            'totalHadir' => 0,
            'attendancePercentage' => 0,
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
}
