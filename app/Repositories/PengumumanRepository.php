<?php

namespace App\Repositories;

use App\Models\Announcement;
use Illuminate\Pagination\LengthAwarePaginator;

class PengumumanRepository
{
    public function allAnnouncements(): LengthAwarePaginator
    {
        return Announcement::query()
            ->with('creator:id,name')
            ->latest()
            ->paginate(10);
    }

    public function findById(int $id): Announcement
    {
        return Announcement::query()->findOrFail($id);
    }

    public function create(array $data): Announcement
    {
        return Announcement::query()->create($data);
    }

    public function update(Announcement $announcement, array $data): bool
    {
        return $announcement->update($data);
    }

    public function delete(Announcement $announcement): bool
    {
        return $announcement->delete();
    }
}
