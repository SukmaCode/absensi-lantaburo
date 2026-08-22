<?php

namespace App\Repositories;

use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
// use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class AbsensiRepository
{
    public function studentAttendances(): LengthAwarePaginator
    {
        return AttendanceStudent::query()
            ->with(['student.user:id,name'])
            ->orderByDesc('date')
            ->orderByDesc('check_in_time')
            ->paginate(10);
    }

    public function teacherAttendances(): LengthAwarePaginator
    {
        return AttendanceTeacher::query()
            ->with(['teacher.user:id,name'])
            ->orderByDesc('date')
            ->orderByDesc('check_in_time')
            ->paginate(10);
    }
}
