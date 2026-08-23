<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Siswa\UpdateStudentProfileRequest;
use App\Models\User;
use App\Services\PengaturanAkunSiswaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanAkunController extends Controller
{
    /**
     * Show the student account settings page.
     */
    public function edit(Request $request, PengaturanAkunSiswaService $service): Response
    {
        /** @var User $user */
        $user = $request->user();

        $data = $service->getSettingsData($user);

        return Inertia::render('siswa/pengaturan', [
            ...$data,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the student profile and account information.
     */
    public function update(UpdateStudentProfileRequest $request, PengaturanAkunSiswaService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $service->updateProfile($user, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengaturan akun dan profil siswa berhasil diperbarui.',
        ]);

        return back()->with('status', 'profile-updated');
    }

    /**
     * Update the student's password.
     */
    public function updatePassword(PasswordUpdateRequest $request, PengaturanAkunSiswaService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $service->updatePassword($user, $request->validated()['password']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kata sandi berhasil diperbarui.',
        ]);

        return back()->with('status', 'password-updated');
    }
}
