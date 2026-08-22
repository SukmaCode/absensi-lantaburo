<?php

namespace App\Services;

use App\Models\Teacher;
use App\Models\User;
use App\Repositories\DataGuruRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DataGuruService
{
    public function __construct(
        private readonly DataGuruRepository $dataGuruRepository,
    ) {}

    public function allTeachers(): array
    {
        $teachers = $this->dataGuruRepository->allTeachers();

        return [
            'teachers' => $teachers->map(fn (Teacher $teacher) => [
                'name' => $teacher->user->name,
                'nip' => $teacher->nip,
                'wali_kelas' => $teacher->homeroomClass?->name,
                'phone' => $teacher->user->phone,
                'status' => $teacher->user->status === 'active' ? 'Aktif' : 'Nonaktif',
                'avatar' => $teacher->user->photo,
            ])->all(),
            'pagination' => [
                'current_page' => $teachers->currentPage(),
                'last_page' => $teachers->lastPage(),
                'total' => $teachers->total(),
                'per_page' => $teachers->perPage(),
                'links' => $teachers->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
    }

    public function createTeacher(array $data): Teacher
    {
        return DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'guru',
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            return Teacher::query()->create([
                'user_id' => $user->id,
                'nip' => $data['nip'],
                'subject' => $data['subject'],
            ]);
        });
    }
}
