<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreParentRequest;
use App\Http\Requests\Admin\UpdateParentRequest;
use App\Services\DataOrangTuaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataOrangTuaController extends Controller
{
    public function __invoke(Request $request, DataOrangTuaService $service): Response
    {
        $search = $request->query('search');

        return Inertia::render('admin/data-orangtua', array_merge(
            $service->allParents(is_string($search) ? $search : null),
            ['availableStudents' => $service->availableStudents()],
        ));
    }

    public function store(StoreParentRequest $request, DataOrangTuaService $service): RedirectResponse
    {
        $service->createParent($request->validated());

        return redirect()->route('admin.data-orangtua')->with('success', 'Data orang tua berhasil ditambahkan.');
    }

    public function update(UpdateParentRequest $request, int $id, DataOrangTuaService $service): RedirectResponse
    {
        $service->updateParent($id, $request->validated());

        return redirect()->route('admin.data-orangtua')->with('success', 'Data orang tua berhasil diperbarui.');
    }

    public function destroy(int $id, DataOrangTuaService $service): RedirectResponse
    {
        $service->deleteParent($id);

        return redirect()->route('admin.data-orangtua')->with('success', 'Data orang tua berhasil dihapus.');
    }
}
