<?php

namespace App\Services;

use App\Models\AttendanceStudent;
use App\Models\Student;
use App\Models\Teacher;
use App\Repositories\GuruRepository;
use Illuminate\Support\Carbon;

class RekapMuridService
{
    public function __construct(private readonly GuruRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getMonthlyRecap(Teacher $teacher, ?string $selectedMonth = null): array
    {
        $homeroomClass = $this->repository->getHomeroomClass($teacher->id);

        // Normalize selectedMonth or default to current Y-m
        $currentDate = $selectedMonth ? Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth() : Carbon::now()->startOfMonth();
        $startDate = $currentDate->copy()->startOfMonth();
        $endDate = $currentDate->copy()->endOfMonth();

        if (! $homeroomClass) {
            return [
                'hasHomeroomClass' => false,
                'classInfo' => null,
                'selectedMonth' => $currentDate->format('Y-m'),
                'monthLabel' => $currentDate->translatedFormat('F Y'),
                'daysInMonth' => [],
                'students' => [],
                'summary' => [
                    'totalHadir' => 0,
                    'totalTerlambat' => 0,
                    'totalIzin' => 0,
                    'totalSakit' => 0,
                    'totalAlpha' => 0,
                ],
            ];
        }

        // Build array of all days in this month
        $daysInMonth = [];
        $dayCursor = $startDate->copy();
        while ($dayCursor->lte($endDate)) {
            $daysInMonth[] = [
                'date' => $dayCursor->toDateString(),
                'dayNumber' => $dayCursor->format('d'),
                'dayName' => $dayCursor->translatedFormat('D'),
                'isWeekend' => $dayCursor->isWeekend(),
                'isToday' => $dayCursor->isToday(),
            ];
            $dayCursor->addDay();
        }

        $students = $this->repository->getMonthlyRecapStudents($homeroomClass->id, $startDate, $endDate);

        $totalHadir = 0;
        $totalTerlambat = 0;
        $totalIzin = 0;
        $totalSakit = 0;
        $totalAlpha = 0;

        $studentRecaps = $students->map(function (Student $student) use (&$totalHadir, &$totalTerlambat, &$totalIzin, &$totalSakit, &$totalAlpha) {
            $attendancesByDate = $student->attendanceRecords
                ->keyBy(fn (AttendanceStudent $att) => Carbon::parse($att->date)->toDateString());

            $hadirCount = 0;
            $terlambatCount = 0;
            $izinCount = 0;
            $sakitCount = 0;
            $alphaCount = 0;

            $dailyStatus = [];
            foreach ($attendancesByDate as $date => $record) {
                $status = $record->status;
                $dailyStatus[$date] = $status;

                match ($status) {
                    'hadir' => $hadirCount++,
                    'terlambat' => $terlambatCount++,
                    'izin' => $izinCount++,
                    'sakit' => $sakitCount++,
                    'alpha' => $alphaCount++,
                    default => null,
                };
            }

            $totalHadir += $hadirCount;
            $totalTerlambat += $terlambatCount;
            $totalIzin += $izinCount;
            $totalSakit += $sakitCount;
            $totalAlpha += $alphaCount;

            $totalEffectivePresent = $hadirCount + $terlambatCount;
            $totalRecorded = $hadirCount + $terlambatCount + $izinCount + $sakitCount + $alphaCount;

            return [
                'id' => $student->id,
                'nis' => $student->nis,
                'name' => $student->user->name,
                'gender' => $student->gender,
                'dailyStatus' => $dailyStatus,
                'hadir' => $hadirCount,
                'terlambat' => $terlambatCount,
                'izin' => $izinCount,
                'sakit' => $sakitCount,
                'alpha' => $alphaCount,
                'totalHadir' => $totalEffectivePresent,
                'attendancePercentage' => $totalRecorded > 0 ? (int) round(($totalEffectivePresent / $totalRecorded) * 100) : 0,
            ];
        })->all();

        return [
            'hasHomeroomClass' => true,
            'classInfo' => [
                'id' => $homeroomClass->id,
                'name' => $homeroomClass->name,
                'gradeLevel' => $homeroomClass->grade_level,
                'totalStudents' => count($studentRecaps),
            ],
            'selectedMonth' => $currentDate->format('Y-m'),
            'monthLabel' => $currentDate->translatedFormat('F Y'),
            'daysInMonth' => $daysInMonth,
            'students' => $studentRecaps,
            'summary' => [
                'totalHadir' => $totalHadir,
                'totalTerlambat' => $totalTerlambat,
                'totalIzin' => $totalIzin,
                'totalSakit' => $totalSakit,
                'totalAlpha' => $totalAlpha,
            ],
        ];
    }
}
