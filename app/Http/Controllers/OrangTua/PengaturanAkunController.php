<?php

namespace App\Http\Controllers\OrangTua;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Models\User;
use App\Services\PengaturanAkunOrangTuaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanAkunController extends Controller
{
    /**
     * Show the parent account settings page.
     */
    public function edit(Request $request, PengaturanAkunOrangTuaService $service): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('orangtua/pengaturan', [
            ...$service->getSettingsData($user),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the parent account information.
     */
    public function update(Request $request, PengaturanAkunOrangTuaService $service): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'photo' => ['nullable'],
            'remove_photo' => ['nullable', 'boolean'],
        ]);

        $service->updateProfile($user, $validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengaturan akun berhasil diperbarui.',
        ]);

        return back()->with('status', 'profile-updated');
    }

    /**
     * Update the parent's password.
     */
    public function updatePassword(PasswordUpdateRequest $request, PengaturanAkunOrangTuaService $service): RedirectResponse
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
