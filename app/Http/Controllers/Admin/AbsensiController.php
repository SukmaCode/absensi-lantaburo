<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/absensi');
    }
}
