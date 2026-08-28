<?php

namespace App\Services;

use App\Models\AttendanceStudent;
use App\Models\Student;
use App\Models\Teacher;
use App\Repositories\GuruRepository;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

class AbsenMuridService
{
    public function __construct(private readonly GuruRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getStudentAttendanceData(Teacher $teacher, ?string $date = null): array
    {
        $homeroomClass = $this->repository->getHomeroomClass($teacher->id);
        $targetDate = $date ? Carbon::parse($date)->toDateString() : today()->toDateString();

        if (! $homeroomClass) {
            return [
                'hasHomeroomClass' => false,
                'classInfo' => null,
                'students' => [],
                'date' => $targetDate,
                'formattedDate' => Carbon::parse($targetDate)->translatedFormat('l, d F Y'),
                'currentTime' => Carbon::now()->format('H:i'),
            ];
        }

        $students = $this->repository->getStudentsWithAttendanceForDate($homeroomClass->id, $targetDate);

        $studentData = $students->map(function (Student $student) {
            /** @var AttendanceStudent|null $attendance */
            $attendance = $student->attendanceRecords->first();

            return [
                'id' => $student->id,
                'nis' => $student->nis,
                'name' => $student->user->name,
                'gender' => $student->gender,
                'currentStatus' => $attendance?->status ?? 'hadir',
                'hasAttended' => $attendance !== null,
                'checkInTime' => $attendance?->check_in_time ? Carbon::createFromFormat('H:i:s', $attendance->check_in_time)->format('H:i') : null,
                'notes' => $attendance?->notes ?? '',
            ];
        })->all();

        return [
            'hasHomeroomClass' => true,
            'classInfo' => [
                'id' => $homeroomClass->id,
                'name' => $homeroomClass->name,
                'gradeLevel' => $homeroomClass->grade_level,
                'totalStudents' => count($studentData),
            ],
            'students' => $studentData,
            'date' => $targetDate,
            'formattedDate' => Carbon::parse($targetDate)->translatedFormat('l, d F Y'),
            'currentTime' => Carbon::now()->format('H:i'),
        ];
    }

    /**
     * @param  array<int, array{student_id: int, status: string, notes: ?string}>  $attendances
     */
    public function saveBatchAttendance(string $date, array $attendances): void
    {
        $now = Carbon::now();
        $currentTime = $now->format('H:i:s');
        if ($currentTime < '08:00:00' || $currentTime > '09:00:00') {
            throw ValidationException::withMessages([
                'attendance_time' => 'Presensi murid hanya dapat dilakukan pada jam 08:00 - 09:00 pagi.',
            ]);
        }

        $this->repository->saveBatchStudentAttendance($date, $attendances);
    }
}
