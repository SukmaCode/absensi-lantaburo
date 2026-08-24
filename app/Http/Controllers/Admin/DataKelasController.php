<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreClassRequest;
use App\Http\Requests\Admin\UpdateClassRequest;
use App\Services\DataKelasService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataKelasController extends Controller
{
    public function __invoke(Request $request, DataKelasService $service): Response
    {
        $search = $request->query('search');

        return Inertia::render('admin/data-kelas', $service->allClassList(is_string($search) ? $search : null));
    }

    public function store(StoreClassRequest $request, DataKelasService $service): RedirectResponse
    {
        $service->createClass($request->validated());

        return redirect()->route('admin.data-kelas')->with('success', 'Data kelas berhasil ditambahkan.');
    }

    public function update(UpdateClassRequest $request, int $id, DataKelasService $service): RedirectResponse
    {
        $service->editClass(array_merge($request->validated(), ['id' => $id]));

        return redirect()->route('admin.data-kelas')->with('success', 'Data kelas berhasil diperbarui.');
    }

    public function destroyHomeroomTeacher(int $id, DataKelasService $service): RedirectResponse
    {
        $service->removeHomeroomTeacher($id);

        return redirect()->route('admin.data-kelas')->with('success', 'Wali kelas berhasil dihapus.');
    }
}
