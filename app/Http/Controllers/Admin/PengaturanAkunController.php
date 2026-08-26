<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAdminProfileRequest;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Models\User;
use App\Services\PengaturanAkunAdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanAkunController extends Controller
{
    /**
     * Show the admin account settings page.
     */
    public function edit(Request $request, PengaturanAkunAdminService $service): Response
    {
        /** @var User $user */
        $user = $request->user();

        $data = $service->getSettingsData($user);

        return Inertia::render('admin/pengaturan', [
            ...$data,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the admin profile and account information.
     */
    public function update(UpdateAdminProfileRequest $request, PengaturanAkunAdminService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $service->updateProfile($user, $request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengaturan akun admin berhasil diperbarui.',
        ]);

        return back()->with('status', 'profile-updated');
    }

    /**
     * Update the admin's password.
     */
    public function updatePassword(PasswordUpdateRequest $request, PengaturanAkunAdminService $service): RedirectResponse
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
