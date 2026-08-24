<?php

namespace App\Services;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PengaturanAkunSiswaService
{
    /**
     * Get data required for student account settings page.
     *
     * @return array{
     *     student: array<string, mixed>,
     *     user: array<string, mixed>,
     *     classes: array<int, array{id: int, name: string, grade_level: string}>
     * }
     */
    public function getSettingsData(User $user): array
    {
        $student = $user->student ?? Student::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nis' => 'S-'.date('Y').str_pad((string) $user->id, 4, '0', STR_PAD_LEFT),
                'gender' => 'L',
            ]
        );

        $classes = SchoolClass::query()
            ->orderBy('grade_level')
            ->orderBy('name')
            ->get(['id', 'name', 'grade_level'])
            ->map(fn (SchoolClass $class) => [
                'id' => $class->id,
                'name' => $class->name,
                'grade_level' => $class->grade_level,
            ])
            ->values()
            ->all();

        return [
            'student' => [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'nis' => $student->nis ?? '',
                'class_id' => $student->class_id,
                'className' => $student->schoolClass?->name,
                'gender' => $student->gender ?? 'L',
                'birth_date' => $student->birth_date ? date('Y-m-d', strtotime((string) $student->birth_date)) : null,
                'address' => $student->address ?? '',
                'parent_name' => $student->parent_name ?? '',
                'parent_phone' => $student->parent_phone ?? '',
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'photo' => $user->photo,
                'avatar' => $user->avatar,
            ],
            'classes' => $classes,
        ];
    }

    /**
     * Update user account and student table records.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data) {
            $student = $user->student ?? Student::firstOrCreate(
                ['user_id' => $user->id],
                // ['nis' => $data['nis'] ?? 'S-'.date('Y').str_pad((string) $user->id, 4, '0', STR_PAD_LEFT), 'gender' => 'L']
            );

            // Handle photo update or removal
            $photoPath = $user->photo;

            if (! empty($data['remove_photo'])) {
                if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                    Storage::disk('public')->delete($user->photo);
                }
                $photoPath = null;
            } elseif (isset($data['photo']) && ! empty($data['photo'])) {
                $newPhoto = $this->handleProfilePhoto($data['photo'], $user->photo);
                if ($newPhoto !== null) {
                    $photoPath = $newPhoto;
                }
            }

            // Update user table
            $userUpdateData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'photo' => $photoPath,
            ];

            if ($user->email !== $data['email']) {
                $userUpdateData['email_verified_at'] = null;
            }

            $user->update($userUpdateData);

            // Update student table
            $student->update([
                // 'nis' => $data['nis'],
                // 'class_id' => $data['class_id'] ?? null,
                'gender' => $data['gender'],
                'birth_date' => $data['birth_date'] ?? null,
                'address' => $data['address'] ?? null,
                'parent_name' => $data['parent_name'] ?? null,
                'parent_phone' => $data['parent_phone'] ?? null,
            ]);
        });
    }

    /**
     * Update user password.
     */
    public function updatePassword(User $user, string $newPassword): void
    {
        $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    /**
     * Handle uploaded file or base64 photo for user profile avatar.
     */
    private function handleProfilePhoto(mixed $photo, ?string $oldPhoto = null): ?string
    {
        if ($oldPhoto && Storage::disk('public')->exists($oldPhoto)) {
            Storage::disk('public')->delete($oldPhoto);
        }

        if ($photo instanceof UploadedFile) {
            return $photo->store('avatars/students', 'public');
        }

        if (is_string($photo) && str_starts_with($photo, 'data:image')) {
            $parts = explode(',', $photo, 2);
            if (count($parts) === 2) {
                $imageData = base64_decode($parts[1]);
                $filename = 'avatars/students/'.uniqid('avatar_student_', true).'.jpg';
                Storage::disk('public')->put($filename, $imageData);

                return $filename;
            }
        }

        return null;
    }
}
