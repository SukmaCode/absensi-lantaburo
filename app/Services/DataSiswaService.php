<?php

namespace App\Services;

use App\Models\SppSetting;
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

    public function allStudents(?string $search = null): array
    {
        $students = $this->dataSiswaRepository->allStudents($search);

        return [
            'students' => $students->map(fn (Student $student) => [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'nis' => $student->nis,
                'class_id' => $student->class_id,
                'class' => $student->schoolClass?->name,
                'gender' => $student->gender,
                'birth_date' => $student->birth_date,
                'address' => $student->address,
                'parent_name' => $student->parent_name,
                'parent_phone' => $student->parent_phone,
                'status' => $student->user->status === 'active' ? 'Aktif' : 'Nonaktif',
                'raw_status' => $student->user->status,
                'payment_status' => $student->user->latestPayment?->status,
                'payment_type' => $student->user->latestPayment?->payment_type,
                'spp_amount' => $student->sppSetting?->amount,
                // 'photo' => $student->user->photo,
            ])->all(),
            'filters' => [
                'search' => $search,
            ],
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

            $student = Student::query()->create([
                'user_id' => $user->id,
                'nis' => $data['nis'],
                'class_id' => $data['class_id'] ?? null,
                'gender' => $data['gender'],
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'parent_name' => $data['parent_name'] ?? null,
                'parent_phone' => $data['parent_phone'] ?? null,
            ]);

            if (isset($data['spp_amount']) && $data['spp_amount'] !== null && $data['spp_amount'] !== '') {
                SppSetting::query()->updateOrCreate(
                    ['student_id' => $student->id],
                    ['amount' => (int) $data['spp_amount']]
                );
            }

            return $student;
        });
    }

    public function editStudent(array $data): Student
    {
        return DB::transaction(function () use ($data) {
            $student = Student::query()->findOrFail($data['id']);

            $userUpdates = [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? $student->user->status,
            ];

            if (! empty($data['password'])) {
                $userUpdates['password'] = Hash::make($data['password']);
            }

            $student->user->update($userUpdates);

            $student->update([
                'nis' => $data['nis'],
                'class_id' => $data['class_id'] ?? null,
                'gender' => $data['gender'],
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'parent_name' => $data['parent_name'] ?? null,
                'parent_phone' => $data['parent_phone'] ?? null,
            ]);

            if (array_key_exists('spp_amount', $data)) {
                if ($data['spp_amount'] !== null && $data['spp_amount'] !== '') {
                    SppSetting::query()->updateOrCreate(
                        ['student_id' => $student->id],
                        ['amount' => (int) $data['spp_amount']]
                    );
                } else {
                    SppSetting::query()->where('student_id', $student->id)->delete();
                }
            }

            return $student;
        });
    }
}
