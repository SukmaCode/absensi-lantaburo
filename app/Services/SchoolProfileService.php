<?php

namespace App\Services;

use App\Models\SchoolProfile;
use App\Repositories\SchoolProfileRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SchoolProfileService
{
    public function __construct(
        private readonly SchoolProfileRepository $schoolProfileRepository,
    ) {}

    public function getSchoolProfile(): ?SchoolProfile
    {
        return $this->schoolProfileRepository->getSchoolProfile();
    }

    public function findBySchoolId(int $school_id): SchoolProfile
    {
        return $this->schoolProfileRepository->findBySchoolId($school_id);
    }

    public function updateSchoolProfile(int $id, array $data): void
    {
        $schoolProfile = $this->schoolProfileRepository->findBySchoolId($id);

        // Validasi Logo
        if (isset($data['logo']) && $data['logo'] instanceof UploadedFile) {
            if ($schoolProfile->logo) {
                Storage::disk('public')->delete($schoolProfile->logo);
            }
            $data['logo'] = $data['logo']->store('logos', 'public');
        } else {
            unset($data['logo']);
        }

        // Validasi Hero Image di Landing Page
        if (isset($data['hero_image']) && $data['hero_image'] instanceof UploadedFile) {
            if ($schoolProfile->hero_image) {
                Storage::disk('public')->delete($schoolProfile->hero_image);
            }
            $data['hero_image'] = $data['hero_image']->store('hero_images', 'public');
        } else {
            unset($data['hero_image']);
        }

        // Validasi About Image di Landing Page
        if (isset($data['about_image']) && $data['about_image'] instanceof UploadedFile) {
            if ($schoolProfile->about_image) {
                Storage::disk('public')->delete($schoolProfile->about_image);
            }
            $data['about_image'] = $data['about_image']->store('about_images', 'public');
        } else {
            unset($data['about_image']);
        }

        // Validasi Activities Image 1 di Landing Page
        if (isset($data['activities_image_1']) && $data['activities_image_1'] instanceof UploadedFile) {
            if ($schoolProfile->activities_image_1) {
                Storage::disk('public')->delete($schoolProfile->activities_image_1);
            }
            $data['activities_image_1'] = $data['activities_image_1']->store('activities_images', 'public');
        } else {
            unset($data['activities_image_1']);
        }

        // Validasi Activities Image 2 di Landing Page
        if (isset($data['activities_image_2']) && $data['activities_image_2'] instanceof UploadedFile) {
            if ($schoolProfile->activities_image_2) {
                Storage::disk('public')->delete($schoolProfile->activities_image_2);
            }
            $data['activities_image_2'] = $data['activities_image_2']->store('activities_images', 'public');
        } else {
            unset($data['activities_image_2']);
        }

        // Validasi Activities Image 3 di Landing Page
        if (isset($data['activities_image_3']) && $data['activities_image_3'] instanceof UploadedFile) {
            if ($schoolProfile->activities_image_3) {
                Storage::disk('public')->delete($schoolProfile->activities_image_3);
            }
            $data['activities_image_3'] = $data['activities_image_3']->store('activities_images', 'public');
        } else {
            unset($data['activities_image_3']);
        }

        $this->schoolProfileRepository->update($schoolProfile, array_filter(
            array_intersect_key($data, array_flip([
                'name',
                'logo',
                'hero_image',
                'about_image',
                'activities_image_1',
                'activities_image_2',
                'activities_image_3',
                'description_heading',
                'description_body',
                'address',
                'phone',
                'email',
            ])),
            fn ($value) => $value !== null,
        ));
    }
}
