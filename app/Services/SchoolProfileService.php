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

    public function findBySchoolId(int $school_id): SchoolProfile
    {
        return $this->schoolProfileRepository->findBySchoolId($school_id);
    }

    public function updateSchoolProfile(int $id, array $data): void
    {
        $schoolProfile = $this->schoolProfileRepository->findBySchoolId($id);

        if (isset($data['logo']) && $data['logo'] instanceof UploadedFile) {
            if ($schoolProfile->logo) {
                Storage::disk('public')->delete($schoolProfile->logo);
            }

            $data['logo'] = $data['logo']->store('logos', 'public');
        } else {
            unset($data['logo']);
        }

        $this->schoolProfileRepository->update($schoolProfile, array_filter(
            array_intersect_key($data, array_flip(['name', 'logo', 'description_heading', 'description_body', 'address', 'phone', 'email'])),
            fn ($value) => $value !== null,
        ));
    }
}
