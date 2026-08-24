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
            ->with([
                'user:id,name,status,phone',
                'user.latestPayment' => fn ($q) => $q->select('payments.id', 'payments.user_id', 'payments.status', 'payments.payment_type'),
                'schoolClass:id,name',
            ])
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
