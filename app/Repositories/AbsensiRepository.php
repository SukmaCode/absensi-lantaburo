<?php

namespace App\Repositories;

use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
// use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AbsensiRepository
{
    public function studentAttendances(?string $search = null): LengthAwarePaginator
    {
        return AttendanceStudent::query()
            ->with(['student.user:id,name', 'student.schoolClass:id,name'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('student.user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                })->orWhereHas('student.schoolClass', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('date')
            ->orderByDesc('check_in_time')
            ->paginate(10);
    }

    public function teacherAttendances(?string $search = null): LengthAwarePaginator
    {
        return AttendanceTeacher::query()
            ->with(['teacher.user:id,name'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('teacher.user', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('date')
            ->orderByDesc('check_in_time')
            ->paginate(10);
    }
}
