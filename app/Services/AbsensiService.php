<?php

namespace App\Services;

use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Repositories\AbsensiRepository;
use Illuminate\Support\Carbon;

class AbsensiService
{
    public function __construct(private readonly AbsensiRepository $repository) {}

    /**
     * @return array<int, array<string, string>>
     */
    public function studentAttendances(): array
    {
        $students = $this->repository->studentAttendances();

        return [
            'data' => $students->map(fn (AttendanceStudent $attendance) => [
                'name' => $attendance->student->user->name,
                'date' => $this->formatDate($attendance->date),
                'time' => $this->formatTime($attendance->check_in_time),
                'status' => $this->statusLabel($attendance->status),
            ])->all(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'total' => $students->total(),
                'per_page' => $students->perPage(),
                'links' => $students->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function teacherAttendances(): array
    {
        $teachers = $this->repository->teacherAttendances();

        return [
            'data' => $teachers->map(fn (AttendanceTeacher $attendance) => [
                'name' => $attendance->teacher->user->name,
                'date' => $this->formatDate($attendance->date),
                'time' => $this->formatTime($attendance->check_in_time),
                'status' => $this->statusLabel($attendance->status),
            ])->all(),
            'pagination' => [
                'current_page' => $teachers->currentPage(),
                'last_page' => $teachers->lastPage(),
                'total' => $teachers->total(),
                'per_page' => $teachers->perPage(),
                'links' => $teachers->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
        // ->map(fn (AttendanceTeacher $attendance) => [
        //     'name' => $attendance->teacher->user->name,
        //     'date' => $this->formatDate($attendance->date),
        //     'time' => $this->formatTime($attendance->check_in_time),
        //     'status' => $this->statusLabel($attendance->status),
        // ])
        // ->all();
    }

    private function formatDate(mixed $date): string
    {
        return Carbon::parse($date)->format('d-m-Y');
    }

    private function formatTime(?string $time): string
    {
        return $time ? Carbon::createFromFormat('H:i:s', $time)->format('H:i') : '-';
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
}
