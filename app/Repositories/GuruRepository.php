<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class GuruRepository
{
    public function todayTeacherAttendance(int $teacherId): ?AttendanceTeacher
    {
        return AttendanceTeacher::query()
            ->where('teacher_id', $teacherId)
            ->whereDate('date', today())
            ->first();
    }

    public function getHomeroomClass(int $teacherId): ?SchoolClass
    {
        return SchoolClass::query()
            ->where('homeroom_teacher_id', $teacherId)
            ->withCount('students')
            ->first();
    }

    /**
     * @return array<string, int>
     */
    public function todayHomeroomStudentAttendanceCounts(int $classId): array
    {
        return AttendanceStudent::query()
            ->whereHas('student', fn ($q) => $q->where('class_id', $classId))
            ->whereDate('date', today())
            ->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($total) => (int) $total)
            ->all();
    }

    public function countHomeroomStudentsAttendedToday(int $classId): int
    {
        return AttendanceStudent::query()
            ->whereHas('student', fn ($q) => $q->where('class_id', $classId))
            ->whereDate('date', today())
            ->distinct()
            ->count('student_id');
    }

    /**
     * @return Collection<int, Announcement>
     */
    public function recentAnnouncementsForTeacher(): Collection
    {
        return Announcement::query()
            ->whereIn('target_role', ['all', 'guru'])
            ->whereNotNull('published_at')
            ->latest('published_at')
            ->take(5)
            ->get();
    }

    /**
     * @return Collection<int, Student>
     */
    public function getStudentsWithAttendanceForDate(int $classId, string $date): Collection
    {
        return Student::query()
            ->where('class_id', $classId)
            ->with([
                'user:id,name',
                'attendanceRecords' => fn ($q) => $q->whereDate('date', $date),
            ])
            ->join('users', 'students.user_id', '=', 'users.id')
            ->orderBy('users.name')
            ->select('students.*')
            ->get();
    }

    /**
     * @param  array{photo_selfie: string, latitude: ?float, longitude: ?float, notes: ?string, status?: string}  $data
     */
    public function saveTeacherAttendance(Teacher $teacher, array $data): AttendanceTeacher
    {
        return AttendanceTeacher::updateOrCreate(
            [
                'teacher_id' => $teacher->id,
                'date' => today()->toDateString(),
            ],
            [
                'check_in_time' => Carbon::now()->format('H:i:s'),
                'status' => $data['status'] ?? 'hadir',
                'photo_selfie' => $data['photo_selfie'],
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]
        );
    }

    /**
     * @param  array<int, array{student_id: int, status: string, notes: ?string}>  $attendances
     */
    public function saveBatchStudentAttendance(string $date, array $attendances): void
    {
        $now = Carbon::now()->format('H:i:s');

        DB::transaction(function () use ($date, $attendances, $now) {
            foreach ($attendances as $item) {
                AttendanceStudent::updateOrCreate(
                    [
                        'student_id' => $item['student_id'],
                        'date' => $date,
                    ],
                    [
                        'check_in_time' => $now,
                        'status' => $item['status'],
                        'notes' => $item['notes'] ?? null,
                    ]
                );
            }
        });
    }

    /**
     * @return Collection<int, Student>
     */
    public function getMonthlyRecapStudents(int $classId, Carbon $startDate, Carbon $endDate): Collection
    {
        return Student::query()
            ->where('class_id', $classId)
            ->with([
                'user:id,name',
                'attendanceRecords' => fn ($q) => $q->whereBetween('date', [
                    $startDate->toDateString(),
                    $endDate->toDateString(),
                ]),
            ])
            ->join('users', 'students.user_id', '=', 'users.id')
            ->orderBy('users.name')
            ->select('students.*')
            ->get();
    }
}
