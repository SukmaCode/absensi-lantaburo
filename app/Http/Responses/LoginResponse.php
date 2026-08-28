<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $redirect = match ($request->user()?->role) {
            'admin' => route('admin.dashboard'),
            'guru' => route('guru.dashboard'),
            'siswa' => route('siswa.dashboard'),
            'calon_siswa' => route('calon-siswa.dashboard'),
            'orang_tua' => route('orangtua.dashboard'),
            default => route('landingpage'),
        };

        return redirect()->intended($redirect);
    }
}
