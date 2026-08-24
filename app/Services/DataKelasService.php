<?php

namespace App\Services;

use App\Models\SchoolClass;
use App\Models\Teacher;
use App\Repositories\DataKelasRepository;

class DataKelasService
{
    public function __construct(
        private readonly DataKelasRepository $dataKelasRepository,
    ) {}

    /**
     * @return array{
     *     classes: array<int, array{
     *         id: int,
     *         name: string,
     *         grade_level: string,
     *         homeroom_teacher: ?string,
     *         homeroom_teacher_id: ?int,
     *         students_count: int
     *     }>,
     *     filters: array{
     *         search: string
     *     },
     *     teachers: array<int, array{
     *         id: int,
     *         name: string,
     *         nip: ?string,
     *         homeroom_class_id: ?int
     *     }>,
     *     pagination: array{
     *         current_page: int,
     *         last_page: int,
     *         total: int,
     *         per_page: int,
     *         links: array<int, array{label: string, url: ?string, active: bool}>
     *     }
     * }
     */
    public function allClassList(?string $search = null): array
    {
        $classes = $this->dataKelasRepository->allClassList($search);

        return [
            'classes' => $classes->map(fn (SchoolClass $class) => [
                'id' => $class->id,
                'name' => $class->name,
                'grade_level' => $class->grade_level,
                'homeroom_teacher' => $class->homeroomTeacher?->user?->name,
                'homeroom_teacher_id' => $class->homeroom_teacher_id,
                'students_count' => (int) ($class->students_count ?? 0),
            ])->all(),
            'filters' => [
                'search' => $search ?? '',
            ],
            'teachers' => $this->dataKelasRepository->allTeachers()
                ->map(fn (Teacher $teacher) => [
                    'id' => $teacher->id,
                    'name' => $teacher->user->name,
                    'nip' => $teacher->nip,
                    'homeroom_class_id' => $teacher->homeroomClass?->id,
                ])->all(),
            'pagination' => [
                'current_page' => $classes->currentPage(),
                'last_page' => $classes->lastPage(),
                'total' => $classes->total(),
                'per_page' => $classes->perPage(),
                'links' => $classes->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
    }

    /**
     * @param  array{name: string, grade_level: string, homeroom_teacher_id?: ?int}  $data
     */
    public function createClass(array $data): SchoolClass
    {
        return SchoolClass::query()->create([
            'name' => $data['name'],
            'grade_level' => $data['grade_level'],
            'homeroom_teacher_id' => $data['homeroom_teacher_id'] ?? null,
        ]);
    }

    /**
     * @param  array{id: int, name: string, grade_level: string, homeroom_teacher_id?: ?int}  $data
     */
    public function editClass(array $data): SchoolClass
    {
        $class = SchoolClass::query()->findOrFail($data['id']);
        $class->update([
            'name' => $data['name'],
            'grade_level' => $data['grade_level'],
            'homeroom_teacher_id' => $data['homeroom_teacher_id'] ?? null,
        ]);

        return $class;
    }

    public function removeHomeroomTeacher(int $id): SchoolClass
    {
        $class = SchoolClass::query()->findOrFail($id);
        $class->update([
            'homeroom_teacher_id' => null,
        ]);

        return $class;
    }
}
