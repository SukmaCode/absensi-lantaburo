<?php

namespace App\Services;

use App\Models\Student;
use App\Models\User;
use App\Repositories\DataSiswaRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DataSiswaService
{
    public function __construct(
        private readonly DataSiswaRepository $dataSiswaRepository,
    ) {}

    public function allStudents(): array
    {
        $students = $this->dataSiswaRepository->allStudents();

        return [
            'students' => $students->map(fn (Student $student) => [
                'name' => $student->user->name,
                'nis' => $student->nis,
                'class' => $student->schoolClass?->name,
                'status' => $student->user->status === 'active' ? 'Aktif' : 'Nonaktif',
                'avatar' => $student->user->photo,
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

    public function classes(): array
    {
        return $this->dataSiswaRepository->allClasses()
            ->map(fn ($class) => [
                'id' => $class->id,
                'name' => $class->name,
            ])
            ->all();
    }

    public function createStudent(array $data): Student
    {
        return DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'siswa',
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            return Student::query()->create([
                'user_id' => $user->id,
                'nis' => $data['nis'],
                'class_id' => $data['class_id'] ?? null,
                'gender' => $data['gender'],
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'parent_name' => $data['parent_name'] ?? null,
                'parent_phone' => $data['parent_phone'] ?? null,
            ]);
        });
    }
}
