<?php

use App\Models\Event;
use App\Models\SchoolProfile;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can visit the landing page', function () {
    SchoolProfile::factory()->create();

    $response = $this->get(route('landingpage'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('landingpage')
        ->has('school')
        ->has('events'));
});

test('landing page only shows upcoming events ordered by date', function () {
    $past = Event::factory()->create([
        'event_date' => now()->subDays(2)->toDateString(),
    ]);

    $first = Event::factory()->create([
        'event_date' => now()->addDays(3)->toDateString(),
    ]);

    $second = Event::factory()->create([
        'event_date' => now()->addDays(1)->toDateString(),
    ]);

    $response = $this->get(route('landingpage'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('events', 2)
        ->where('events.0.id', $second->id)
        ->where('events.1.id', $first->id));
});
