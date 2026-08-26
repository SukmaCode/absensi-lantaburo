<?php

namespace App\Repositories;

use App\Models\Teacher;
use Illuminate\Pagination\LengthAwarePaginator;

// use Illuminate\Support\Collection;

class DataGuruRepository
{
    public function allTeachers(?string $search = null): LengthAwarePaginator
    {
        return Teacher::query()
            ->with(['user:id,name,email,status,photo,phone', 'homeroomClass:id,name,homeroom_teacher_id'])
            ->when($search, function ($query, string $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nip', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('homeroomClass', function ($classQuery) use ($search) {
                            $classQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(5)
            ->withQueryString();
    }
}
