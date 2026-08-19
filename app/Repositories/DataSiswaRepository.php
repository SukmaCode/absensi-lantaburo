<?php

namespace App\Repositories;

use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DataSiswaRepository
{
    public function allStudents(): LengthAwarePaginator
    {
        return Student::query()
            ->with(['user:id,name,status,photo', 'schoolClass:id,name'])
            ->latest()
            ->paginate(5);
    }

    public function allClasses(): Collection
    {
        return SchoolClass::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
