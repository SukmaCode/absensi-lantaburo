<?php

namespace App\Http\Controllers;

use App\Services\EventService;
use App\Services\SchoolProfileService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __construct(
        private readonly SchoolProfileService $schoolProfileService,
        private readonly EventService $eventService,
    ) {}

    /**
     * Show the public landing page.
     */
    public function __invoke(): Response
    {
        $school = $this->schoolProfileService->getSchoolProfile();
        $events = $this->eventService->getUpcomingEvents();

        return Inertia::render('landingpage', [
            'school' => $school,
            'events' => $events,
        ]);
    }
}
