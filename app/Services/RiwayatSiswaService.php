<?php

namespace App\Services;

use App\Models\Student;
use App\Repositories\SiswaRepository;
use Illuminate\Support\Carbon;

class RiwayatSiswaService
{
    public function __construct(private readonly SiswaRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getHistoryData(Student $student, ?string $month): array
    {
        $selectedDate = $month ? Carbon::createFromFormat('Y-m', $month) : Carbon::now();
        $start = $selectedDate->copy()->startOfMonth();
        $end = $selectedDate->copy()->endOfMonth();

        $records = $this->repository->getMonthlyAttendance($student->id, $start, $end);
        $counts = $this->repository->getMonthlyAttendanceCounts($student->id, $start, $end);

        $totalRecorded = array_sum($counts);
        $hadirCount = ($counts['hadir'] ?? 0) + ($counts['terlambat'] ?? 0);
        $attendanceRate = $totalRecorded > 0 ? (int) round($hadirCount / $totalRecorded * 100) : 0;

        $history = $records->map(fn ($record) => [
            'date' => Carbon::parse($record->date)->translatedFormat('d F Y'),
            'dayName' => Carbon::parse($record->date)->translatedFormat('l'),
            'status' => $record->status,
            'statusLabel' => $this->statusLabel($record->status ?? 'hadir'),
            'checkInTime' => $this->formatTime($record->check_in_time),
            'notes' => $record->notes,
            'photoUrl' => $record->photo_selfie ? asset('storage/'.$record->photo_selfie) : null,
        ])->all();

        return [
            'selectedMonth' => $selectedDate->format('Y-m'),
            'selectedMonthLabel' => $selectedDate->translatedFormat('F Y'),
            'prevMonth' => $selectedDate->copy()->subMonth()->format('Y-m'),
            'nextMonth' => $selectedDate->copy()->addMonth()->format('Y-m'),
            'isCurrentMonth' => $selectedDate->isSameMonth(Carbon::now()),
            'stats' => [
                'hadir' => $counts['hadir'] ?? 0,
                'terlambat' => $counts['terlambat'] ?? 0,
                'izin' => $counts['izin'] ?? 0,
                'sakit' => $counts['sakit'] ?? 0,
                'alpha' => $counts['alpha'] ?? 0,
                'attendanceRate' => $attendanceRate,
                'totalRecorded' => $totalRecorded,
            ],
            'history' => $history,
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
