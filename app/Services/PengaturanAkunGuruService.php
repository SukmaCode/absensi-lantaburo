<?php

namespace App\Services;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PengaturanAkunGuruService
{
    /**
     * Get data required for teacher account settings page.
     *
     * @return array{
     *     teacher: array<string, mixed>,
     *     user: array<string, mixed>,
     * }
     */
    public function getSettingsData(User $user): array
    {
        $teacher = $user->teacher ?? Teacher::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nip' => null,
                'subject' => null,
            ]
        );

        $homeroomClass = $teacher->homeroomClass;

        return [
            'teacher' => [
                'id' => $teacher->id,
                'user_id' => $teacher->user_id,
                'nip' => $teacher->nip ?? '',
                'subject' => $teacher->subject ?? '',
                'homeroomClass' => $homeroomClass ? [
                    'id' => $homeroomClass->id,
                    'name' => $homeroomClass->name,
                    'gradeLevel' => $homeroomClass->grade_level,
                ] : null,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'photo' => $user->photo,
                'avatar' => $user->avatar,
                'status' => $user->status,
            ],
        ];
    }

    /**
     * Update user account and teacher table records.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data) {
            $teacher = $user->teacher ?? Teacher::firstOrCreate(['user_id' => $user->id]);

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

            // Update teacher table
            $teacher->update([
                'nip' => ! empty($data['nip']) ? $data['nip'] : null,
                'subject' => ! empty($data['subject']) ? $data['subject'] : null,
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
            return $photo->store('avatars/teachers', 'public');
        }

        if (is_string($photo) && str_starts_with($photo, 'data:image')) {
            $parts = explode(',', $photo, 2);
            if (count($parts) === 2) {
                $imageData = base64_decode($parts[1]);
                $filename = 'avatars/teachers/'.uniqid('avatar_teacher_', true).'.jpg';
                Storage::disk('public')->put($filename, $imageData);

                return $filename;
            }
        }

        return null;
    }
}
