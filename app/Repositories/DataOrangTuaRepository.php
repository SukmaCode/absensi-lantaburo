<?php

namespace App\Repositories;

use App\Models\ParentProfile;
use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class DataOrangTuaRepository
{
    public function allParents(?string $search = null): LengthAwarePaginator
    {
        return ParentProfile::query()
            ->with([
                'user:id,name,email,status,photo,phone',
                'students.user:id,name,photo',
                'students.schoolClass:id,name',
            ])
            ->when($search, function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                        ->orWhereHas('students', function ($studentQuery) use ($search) {
                            $studentQuery->where('nis', 'like', "%{$search}%")
                                ->orWhereHas('user', function ($studentUserQuery) use ($search) {
                                    $studentUserQuery->where('name', 'like', "%{$search}%");
                                })
                                ->orWhereHas('schoolClass', function ($classQuery) use ($search) {
                                    $classQuery->where('name', 'like', "%{$search}%");
                                });
                        });
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * @return Collection<int, Student>
     */
    public function allStudents(): Collection
    {
        return Student::query()
            ->with([
                'user:id,name',
                'schoolClass:id,name',
            ])
            ->whereHas('user')
            ->get()
            ->sortBy(fn (Student $student) => $student->user->name ?? '')
            ->values();
    }

    /**
     * @return Collection<int, Student>
     */
    public function availableStudent(?int $parentId = null): Collection
    {
        return Student::query()
            ->with('user:id,name', 'schoolClass:id,name')
            ->where(function ($query) use ($parentId) {
                $query->whereNull('parent_id');

                if ($parentId !== null) {
                    $query->orWhere('parent_id', $parentId);
                }
            })
            ->whereHas('user')
            ->get()
            ->sortBy(fn (Student $student) => $student->user->name ?? '')
            ->values();
    }
}
