<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStudentRequest;
use App\Http\Requests\Admin\UpdateStudentRequest;
use App\Services\DataSiswaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataSiswaController extends Controller
{
    public function __invoke(Request $request, DataSiswaService $service): Response
    {
        $search = $request->input('search');

        return Inertia::render('admin/data-siswa', array_merge(
            $service->allStudents($search),
            ['classes' => $service->classes()],
        ));
    }

    public function create(StoreStudentRequest $request, DataSiswaService $service): RedirectResponse
    {
        $service->createStudent($request->validated());

        return redirect()->route('admin.data-siswa')->with('success', 'Data siswa berhasil ditambahkan.');
    }

    public function update(UpdateStudentRequest $request, int $id, DataSiswaService $service): RedirectResponse
    {
        $service->editStudent(array_merge($request->validated(), ['id' => $id]));

        return redirect()->route('admin.data-siswa')->with('success', 'Data siswa berhasil diperbarui.');
    }
}
