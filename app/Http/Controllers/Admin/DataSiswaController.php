<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Services\DataSiswaService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DataSiswaController extends Controller
{
    public function __invoke(DataSiswaService $service): Response
    {
        return Inertia::render('admin/data-siswa', array_merge(
            $service->allStudents(),
            ['classes' => $service->classes()],
        ));
    }

    public function create(StoreStudentRequest $request, DataSiswaService $service): RedirectResponse
    {
        $service->createStudent($request->validated());

        return back();
    }
}
