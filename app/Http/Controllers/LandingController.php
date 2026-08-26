<?php

namespace App\Http\Controllers;

use App\Models\SchoolProfile;
use App\Services\EventService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __construct(
        private readonly EventService $eventService,
    ) {}

    /**
     * Show the public landing page.
     */
    public function __invoke(): Response
    {
        $school = SchoolProfile::first();
        $events = $this->eventService->getUpcomingEvents();

        return Inertia::render('landingpage', [
            'school' => $school,
            'events' => $events,
        ]);
    }
}
