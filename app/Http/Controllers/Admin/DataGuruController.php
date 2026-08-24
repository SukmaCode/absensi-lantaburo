<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeacherRequest;
use App\Http\Requests\Admin\UpdateTeacherRequest;
use App\Services\DataGuruService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DataGuruController extends Controller
{
    public function __invoke(DataGuruService $service): Response
    {
        return Inertia::render('admin/data-guru', $service->allTeachers());
    }

    public function create(StoreTeacherRequest $request, DataGuruService $service): RedirectResponse
    {
        $service->createTeacher($request->validated());

        return redirect()->route('admin.data-guru')->with('success', 'Guru berhasil ditambahkan');
    }

    public function update(UpdateTeacherRequest $request, int $id, DataGuruService $service): RedirectResponse
    {
        $service->updateTeacher($id, $request->validated());

        return redirect()->route('admin.data-guru')->with('success', 'Data guru berhasil diperbarui.');
    }

    public function destroy(int $id, DataGuruService $service): RedirectResponse
    {
        $service->deleteTeacher($id);

        return redirect()->route('admin.data-guru')->with('success', 'Data guru berhasil dihapus.');
    }
}
