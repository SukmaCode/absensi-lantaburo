<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Services\EventService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __invoke(Request $request, EventService $service): Response
    {
        return Inertia::render('admin/event', $service->allEvents($request->query('search')));
    }

    public function store(StoreEventRequest $request, EventService $service): RedirectResponse
    {
        $service->createEvent($request->validated());

        return redirect()->route('admin.event')->with('success', 'Agenda kegiatan berhasil ditambahkan.');
    }

    public function update(UpdateEventRequest $request, int $id, EventService $service): RedirectResponse
    {
        $service->updateEvent($id, $request->validated());

        return redirect()->route('admin.event')->with('success', 'Agenda kegiatan berhasil diperbarui.');
    }

    public function destroy(int $id, EventService $service): RedirectResponse
    {
        $service->deleteEvent($id);

        return redirect()->route('admin.event')->with('success', 'Agenda kegiatan berhasil dihapus.');
    }
}
