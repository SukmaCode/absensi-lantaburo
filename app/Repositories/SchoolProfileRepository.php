<?php

namespace App\Repositories;

use App\Models\SchoolProfile;

class SchoolProfileRepository
{
    public function findBySchoolId(int $school_id): SchoolProfile
    {
        return SchoolProfile::query()->findOrFail($school_id);
    }

    public function update(SchoolProfile $schoolProfile, array $data): bool
    {
        return $schoolProfile->update($data);
    }

    public function delete(SchoolProfile $schoolProfile): bool
    {
        return $schoolProfile->delete();
    }
}
