<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\SchoolProfile;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Show the public landing page.
     */
    public function __invoke(): Response
    {
        $school = SchoolProfile::first();

        $events = Event::query()
            ->where('event_date', '>=', Carbon::now()->startOfDay())
            ->orderBy('event_date')
            ->take(3)
            ->get(['id', 'title', 'description', 'event_date', 'location']);

        return Inertia::render('landingpage', [
            'school' => $school,
            'events' => $events,
        ]);
    }
}
