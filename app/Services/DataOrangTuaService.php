<?php

namespace App\Services;

use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\User;
use App\Repositories\DataOrangTuaRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DataOrangTuaService
{
    public function __construct(
        private readonly DataOrangTuaRepository $dataOrangTuaRepository,
    ) {}

    public function allParents(?string $search = null): array
    {
        $parents = $this->dataOrangTuaRepository->allParents($search);

        return [
            'parents' => $parents->map(fn (ParentProfile $parent) => [
                'id' => $parent->id,
                'user_id' => $parent->user_id,
                'name' => $parent->user?->name ?? '-',
                'email' => $parent->user?->email ?? '-',
                'phone' => $parent->user?->phone,
                'status' => $parent->user?->status === 'active' ? 'Aktif' : 'Nonaktif',
                'raw_status' => $parent->user?->status ?? 'active',
                'avatar' => $parent->user?->photo,
                'students' => $parent->students->map(fn (Student $student) => [
                    'id' => $student->id,
                    'name' => $student->user?->name ?? 'Siswa #'.$student->id,
                    'nis' => $student->nis,
                    'class' => $student->schoolClass?->name,
                ])->values()->all(),
                'student_ids' => $parent->students->pluck('id')->all(),
            ])->all(),
            'filters' => [
                'search' => $search ?? '',
            ],
            'pagination' => [
                'current_page' => $parents->currentPage(),
                'last_page' => $parents->lastPage(),
                'total' => $parents->total(),
                'per_page' => $parents->perPage(),
                'links' => $parents->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
    }

    /**
     * @return array<int, array{id: int, name: string, nis: string, class: ?string, parent_id: ?int}>
     */
    public function availableStudents(?int $parentId = null): array
    {
        return $this->dataOrangTuaRepository->availableStudent($parentId)->map(fn (Student $student) => [
            'id' => $student->id,
            'name' => $student->user?->name ?? 'Siswa #'.$student->id,
            'nis' => $student->nis,
            'class' => $student->schoolClass?->name,
            'parent_id' => $student->parent_id,
        ])->all();
    }

    public function createParent(array $data): ParentProfile
    {
        return DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'orang_tua',
                'phone' => $data['phone'] ?? null,
                'status' => $data['status'] ?? 'active',
            ]);

            $parent = ParentProfile::query()->create([
                'user_id' => $user->id,
            ]);

            $studentIds = $data['student_ids'] ?? [];
            if (! empty($studentIds)) {
                Student::query()
                    ->whereIn('id', $studentIds)
                    ->update([
                        'parent_id' => $parent->id,
                        'parent_name' => $user->name,
                        'parent_phone' => $user->phone,
                    ]);
            }

            return $parent;
        });
    }

    public function updateParent(int $id, array $data): ParentProfile
    {
        return DB::transaction(function () use ($id, $data) {
            $parent = ParentProfile::query()->findOrFail($id);
            $user = $parent->user;

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

            $studentIds = $data['student_ids'] ?? [];

            // Unlink removed students
            Student::query()
                ->where('parent_id', $parent->id)
                ->whereNotIn('id', $studentIds)
                ->update([
                    'parent_id' => null,
                ]);

            // Link or update current students
            if (! empty($studentIds)) {
                Student::query()
                    ->whereIn('id', $studentIds)
                    ->update([
                        'parent_id' => $parent->id,
                        'parent_name' => $user?->name,
                        'parent_phone' => $user?->phone,
                    ]);
            }

            return $parent;
        });
    }

    public function deleteParent(int $id): bool
    {
        return DB::transaction(function () use ($id) {
            $parent = ParentProfile::query()->findOrFail($id);

            Student::query()
                ->where('parent_id', $parent->id)
                ->update([
                    'parent_id' => null,
                ]);

            $user = $parent->user;

            $parent->delete();
            $user?->delete();

            return true;
        });
    }
}
