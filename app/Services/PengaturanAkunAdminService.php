<?php

namespace App\Services;

use App\Models\SchoolClass;
use App\Models\SchoolProfile;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PengaturanAkunAdminService
{
    /**
     * Get data required for admin account settings page.
     *
     * @return array{
     *     user: array<string, mixed>,
     *     systemStats: array<string, mixed>,
     * }
     */
    public function getSettingsData(User $user): array
    {
        $schoolProfile = SchoolProfile::first();

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'photo' => $user->photo,
                'avatar' => $user->avatar,
                'status' => $user->status ?? 'active',
                'role' => $user->role,
                'created_at' => $user->created_at?->translatedFormat('d F Y') ?? '',
                'email_verified_at' => $user->email_verified_at ? $user->email_verified_at->translatedFormat('d F Y H:i') : null,
            ],
            'systemStats' => [
                'totalTeachers' => Teacher::count(),
                'totalStudents' => Student::count(),
                'totalClasses' => SchoolClass::count(),
                'schoolName' => $schoolProfile?->name ?? 'Pondok Pesantren Lan Taburo',
            ],
        ];
    }

    /**
     * Update admin user record.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data) {
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
        });
    }

    /**
     * Update admin password.
     */
    public function updatePassword(User $user, string $newPassword): void
    {
        $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    /**
     * Handle uploaded file or base64 photo for admin profile avatar.
     */
    private function handleProfilePhoto(mixed $photo, ?string $oldPhoto = null): ?string
    {
        if ($oldPhoto && Storage::disk('public')->exists($oldPhoto)) {
            Storage::disk('public')->delete($oldPhoto);
        }

        if ($photo instanceof UploadedFile) {
            return $photo->store('avatars/admins', 'public');
        }

        if (is_string($photo) && str_starts_with($photo, 'data:image')) {
            $parts = explode(',', $photo, 2);
            if (count($parts) === 2) {
                $imageData = base64_decode($parts[1]);
                $filename = 'avatars/admins/'.uniqid('avatar_admin_', true).'.jpg';
                Storage::disk('public')->put($filename, $imageData);

                return $filename;
            }
        }

        return null;
    }
}
