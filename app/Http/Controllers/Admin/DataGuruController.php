<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeacherRequest;
use App\Http\Requests\Admin\UpdateTeacherRequest;
use App\Services\DataGuruService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataGuruController extends Controller
{
    public function __invoke(Request $request, DataGuruService $service): Response
    {
        $search = $request->query('search');

        return Inertia::render('admin/data-guru', $service->allTeachers(is_string($search) ? $search : null));
    }

    // public function search(Request $request, DataGuruService $service): Collection
    // {
    //     return $service->searchTeachers($request->search);
    // }

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
