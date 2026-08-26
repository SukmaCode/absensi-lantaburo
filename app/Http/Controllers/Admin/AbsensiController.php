<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AbsensiService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    public function __invoke(Request $request, AbsensiService $service): Response
    {
        $search = $request->input('search');

        return Inertia::render('admin/absensi', [
            'studentAttendances' => $service->studentAttendances($search),
            'teacherAttendances' => $service->teacherAttendances($search),
        ]);
    }
}
