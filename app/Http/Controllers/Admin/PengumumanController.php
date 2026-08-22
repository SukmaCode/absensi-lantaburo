<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Services\PengumumanService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PengumumanController extends Controller
{
    public function __invoke(PengumumanService $service): Response
    {
        return Inertia::render('admin/pengumuman', $service->allAnnouncements());
    }

    public function store(StoreAnnouncementRequest $request, PengumumanService $service): RedirectResponse
    {
        $service->createAnnouncement($request->validated());

        return redirect()->route('admin.pengumuman')->with('success', 'Pengumuman berhasil ditambahkan.');
    }

    public function update(UpdateAnnouncementRequest $request, int $id, PengumumanService $service): RedirectResponse
    {
        $service->updateAnnouncement($id, $request->validated());

        return redirect()->route('admin.pengumuman')->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(int $id, PengumumanService $service): RedirectResponse
    {
        $service->deleteAnnouncement($id);

        return redirect()->route('admin.pengumuman')->with('success', 'Pengumuman berhasil dihapus.');
    }
}
