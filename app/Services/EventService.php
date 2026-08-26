<?php

namespace App\Services;

use App\Models\Event;
use App\Repositories\EventRepository;
use Illuminate\Database\Eloquent\Collection;

class EventService
{
    public function __construct(
        private readonly EventRepository $eventRepository,
    ) {}

    /**
     * @return Collection<int, Event>
     */
    public function getUpcomingEvents(?int $limit = null): Collection
    {
        return $this->eventRepository->findUpcomingEvents($limit);
    }

    /**
     * @return Collection<int, Event>
     */
    public function getAllEvents(): Collection
    {
        return $this->eventRepository->all();
    }

    public function allEvents(?string $search = null): array
    {
        $events = $this->eventRepository->paginateEvents($search);

        return [
            'events' => $events->map(fn (Event $event) => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'event_date' => $event->event_date?->format('Y-m-d'),
                'location' => $event->location,
                'contact_person' => $event->contact_person,
                'phone' => $event->phone,
                'created_at' => $event->created_at?->toDateTimeString(),
            ])->all(),
            'filters' => [
                'search' => $search ?? '',
            ],
            'pagination' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
                'per_page' => $events->perPage(),
                'links' => $events->linkCollection()->map(fn ($link) => [
                    'label' => $link['label'],
                    'url' => $link['url'],
                    'active' => $link['active'],
                ])->values()->all(),
            ],
        ];
    }

    public function createEvent(array $data): Event
    {
        return $this->eventRepository->create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'event_date' => $data['event_date'],
            'location' => $data['location'] ?? null,
            'contact_person' => $data['contact_person'] ?? null,
            'phone' => $data['phone'] ?? null,
        ]);
    }

    public function updateEvent(int $id, array $data): void
    {
        $event = $this->eventRepository->findById($id);

        $this->eventRepository->update($event, [
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'event_date' => $data['event_date'],
            'location' => $data['location'] ?? null,
            'contact_person' => $data['contact_person'] ?? null,
            'phone' => $data['phone'] ?? null,
        ]);
    }

    public function deleteEvent(int $id): void
    {
        $event = $this->eventRepository->findById($id);
        $this->eventRepository->delete($event);
    }
}
