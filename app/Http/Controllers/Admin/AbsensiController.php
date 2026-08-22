<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AbsensiService;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    public function __invoke(AbsensiService $service): Response
    {
        return Inertia::render('admin/absensi', [
            'studentAttendances' => $service->studentAttendances(),
            'teacherAttendances' => $service->teacherAttendances(),
        ]);
    }
}
