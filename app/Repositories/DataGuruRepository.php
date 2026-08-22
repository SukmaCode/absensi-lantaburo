<?php

namespace App\Repositories;

use App\Models\Teacher;
use Illuminate\Pagination\LengthAwarePaginator;

// use Illuminate\Support\Collection;

class DataGuruRepository
{
    public function allTeachers(): LengthAwarePaginator
    {
        return Teacher::query()
            ->with(['user:id,name,status,photo,phone', 'homeroomClass:id,name,homeroom_teacher_id'])
            ->latest()
            ->paginate(5);
    }
}
