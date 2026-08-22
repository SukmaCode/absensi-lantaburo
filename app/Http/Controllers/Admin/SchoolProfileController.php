<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSchoolProfileRequest;
use App\Services\SchoolProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SchoolProfileController extends Controller
{
    public function __construct(
        private readonly SchoolProfileService $schoolProfileService
    ) {}

    public function __invoke(): Response
    {
        $schoolProfile = $this->schoolProfileService->findBySchoolId(1);

        return Inertia::render('admin/pengaturan-sekolah', [
            'schoolProfile' => $schoolProfile,
        ]);
    }

    public function update(UpdateSchoolProfileRequest $request, int $id): RedirectResponse
    {
        $this->schoolProfileService->updateSchoolProfile($id, $request->validated());

        return redirect()->route('admin.school-profile')->with('success', 'Profil sekolah berhasil diperbarui.');
    }
}
