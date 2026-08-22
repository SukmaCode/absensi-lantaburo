<?php

namespace App\Services;

use App\Models\Announcement;
use App\Repositories\PengumumanRepository;
use Illuminate\Support\Facades\Auth;

class PengumumanService
{
    public function __construct(
        private readonly PengumumanRepository $pengumumanRepository,
    ) {}

    public function allAnnouncements(): array
    {
        $announcements = $this->pengumumanRepository->allAnnouncements();

        return [
            'announcements' => $announcements->map(fn (Announcement $announcement) => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'content' => $announcement->content,
                'target_role' => $announcement->target_role,
                'published_at' => $announcement->published_at?->toDateTimeString(),
                'created_at' => $announcement->created_at?->toDateTimeString(),
                'creator_name' => $announcement->creator?->name,
            ])->all(),
            'pagination' => [
                'current_page' => $announcements->currentPage(),
                'last_page' => $announcements->lastPage(),
                'total' => $announcements->total(),
                'per_page' => $announcements->perPage(),
                'links' => $announcements->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
    }

    public function createAnnouncement(array $data): Announcement
    {
        return $this->pengumumanRepository->create([
            'title' => $data['title'],
            'content' => $data['content'],
            'target_role' => $data['target_role'],
            'published_at' => $data['published_at'] ?? now(),
            'created_by' => Auth::id(),
        ]);
    }

    public function updateAnnouncement(int $id, array $data): void
    {
        $announcement = $this->pengumumanRepository->findById($id);

        $this->pengumumanRepository->update($announcement, [
            'title' => $data['title'],
            'content' => $data['content'],
            'target_role' => $data['target_role'],
            'published_at' => $data['published_at'] ?? $announcement->published_at,
        ]);
    }

    public function deleteAnnouncement(int $id): void
    {
        $announcement = $this->pengumumanRepository->findById($id);
        $this->pengumumanRepository->delete($announcement);
    }
}
