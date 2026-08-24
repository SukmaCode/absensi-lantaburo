<?php

namespace App\Repositories;

use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class DataKelasRepository
{
    public function allClassList(?string $search = null): LengthAwarePaginator
    {
        return SchoolClass::query()
            ->with(['homeroomTeacher.user:id,name'])
            ->withCount('students')
            ->when($search, function (Builder $query, string $search) {
                $query->where(function (Builder $q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('grade_level', 'like', "%{$search}%")
                        ->orWhereHas('homeroomTeacher.user', function (Builder $userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('name', 'asc')
            ->paginate(5)
            ->withQueryString();
    }

    /**
     * @return Collection<int, Teacher>
     */
    public function allTeachers(): Collection
    {
        return Teacher::query()
            ->with(['user:id,name', 'homeroomClass:id,homeroom_teacher_id'])
            ->get();
    }
}
