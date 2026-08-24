<?php

namespace App\Services;

use App\Models\SchoolClass;
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
                'id' => $teacher->id,
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'nip' => $teacher->nip,
                'subject' => $teacher->subject,
                'wali_kelas' => $teacher->homeroomClass?->name,
                'phone' => $teacher->user->phone,
                'status' => $teacher->user->status === 'active' ? 'Aktif' : 'Nonaktif',
                'raw_status' => $teacher->user->status,
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

    public function updateTeacher(int $id, array $data): Teacher
    {
        return DB::transaction(function () use ($id, $data) {
            $teacher = Teacher::query()->findOrFail($id);
            $user = $teacher->user;

            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? 'active',
            ];

            if (! empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            $user?->update($userData);

            $teacher->update([
                'nip' => $data['nip'],
                'subject' => $data['subject'],
            ]);

            return $teacher;
        });
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

    public function deleteTeacher(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $teacher = Teacher::query()->findOrFail($id);

            SchoolClass::query()
                ->where('homeroom_teacher_id', $teacher->id)
                ->update(['homeroom_teacher_id' => null]);

            $user = $teacher->user;

            $teacher->delete();
            $user?->delete();

            return true;
        });
    }
}
