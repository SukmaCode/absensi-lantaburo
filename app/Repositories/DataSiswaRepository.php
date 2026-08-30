<?php

namespace App\Repositories;

use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class DataSiswaRepository
{
    public function allStudents(?string $search = null): LengthAwarePaginator
    {
        return Student::query()
            ->with([
                'user:id,name,email,status,phone',
                'user.latestPayment' => fn ($q) => $q->select('payments.id', 'payments.user_id', 'payments.status', 'payments.payment_type'),
                'schoolClass:id,name',
                'sppSetting:id,student_id,amount,notes',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where('nis', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('schoolClass', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%");
                    });
            })
            ->orderBy('id', 'asc')
            ->paginate(5);
    }

    public function allClasses(): Collection
    {
        return SchoolClass::query()
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function getStatusPayment(): Collection
    {
        return collect();
    }
}
