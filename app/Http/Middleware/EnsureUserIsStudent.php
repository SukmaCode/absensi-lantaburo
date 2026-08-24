<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsStudent
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! in_array($request->user()?->role, ['siswa', 'student'], true)) {
            if ($request->user()?->role === 'calon_siswa') {
                return redirect()->route('calon-siswa.dashboard');
            }

            abort(403);
        }

        return $next($request);
    }
}
