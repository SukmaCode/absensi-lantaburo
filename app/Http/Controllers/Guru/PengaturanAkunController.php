<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guru\UpdateTeacherProfileRequest;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Models\User;
use App\Services\PengaturanAkunGuruService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanAkunController extends Controller
{
    /**
     * Show the teacher account settings page.
     */
    public function edit(Request $request, PengaturanAkunGuruService $service): Response
    {
        /** @var User $user */
        $user = $request->user();

        $data = $service->getSettingsData($user);

        return Inertia::render('guru/pengaturan', [
            ...$data,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the teacher profile and account information.
     */
    public function update(UpdateTeacherProfileRequest $request, PengaturanAkunGuruService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $service->updateProfile($user, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengaturan akun dan profil guru berhasil diperbarui.',
        ]);

        return back()->with('status', 'profile-updated');
    }

    /**
     * Update the teacher's password.
     */
    public function updatePassword(PasswordUpdateRequest $request, PengaturanAkunGuruService $service): RedirectResponse
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
