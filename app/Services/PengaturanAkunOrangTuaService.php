<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PengaturanAkunOrangTuaService
{
    /**
     * Get data required for parent account settings page.
     *
     * @return array{user: array<string, mixed>}
     */
    public function getSettingsData(User $user): array
    {
        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'photo' => $user->photo,
                'avatar' => $user->avatar,
            ],
        ];
    }

    /**
     * Update user account information.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateProfile(User $user, array $data): void
    {
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

        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'photo' => $photoPath,
        ];

        if ($user->email !== $data['email']) {
            $updateData['email_verified_at'] = null;
        }

        $user->update($updateData);
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
            return $photo->store('avatars/parents', 'public');
        }

        if (is_string($photo) && str_starts_with($photo, 'data:image')) {
            $parts = explode(',', $photo, 2);
            if (count($parts) === 2) {
                $imageData = base64_decode($parts[1]);
                $filename = 'avatars/parents/'.uniqid('avatar_parent_', true).'.jpg';
                Storage::disk('public')->put($filename, $imageData);

                return $filename;
            }
        }

        return null;
    }
}
