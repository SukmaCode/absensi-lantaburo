<?php

namespace App\Repositories;

use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EventRepository
{
    public function paginateEvents(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        return Event::query()
            ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('contact_person', 'like', "%{$search}%");
            })
            ->orderBy('id', 'asc')
            ->paginate($perPage);
    }

    /**
     * @return Collection<int, Event>
     */
    public function findUpcomingEvents(?int $limit = null): Collection
    {
        $query = Event::query()
            ->whereDate('event_date', '>=', Carbon::today())
            ->orderBy('event_date', 'asc');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }

    /**
     * @return Collection<int, Event>
     */
    public function all(): Collection
    {
        return Event::query()->orderBy('event_date', 'desc')->get();
    }

    public function findById(int $id): Event
    {
        return Event::query()->findOrFail($id);
    }

    public function create(array $data): Event
    {
        return Event::query()->create($data);
    }

    public function update(Event $event, array $data): bool
    {
        return $event->update($data);
    }

    public function delete(Event $event): bool
    {
        return $event->delete();
    }
}
