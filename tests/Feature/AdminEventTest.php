<?php

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

function adminEventUser(): User
{
    return User::factory()->create(['role' => 'admin', 'status' => 'active']);
}

test('admin can view the event index page', function () {
    $admin = adminEventUser();

    Event::factory()->count(3)->create();

    $this->actingAs($admin)
        ->get('/admin/event')
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('admin/event')
                ->has('events', 3)
                ->has('pagination'),
        );
});

test('admin can create a new event', function () {
    $admin = adminEventUser();

    $this->actingAs($admin)
        ->post('/admin/event', [
            'title' => 'Open House Sekolah',
            'description' => 'Kegiatan pengenalan lingkungan sekolah.',
            'event_date' => now()->addDays(10)->toDateString(),
            'location' => 'Kampus Lantaburo',
            'contact_person' => 'Budi Santoso',
            'phone' => '08123456789',
        ])
        ->assertRedirect('/admin/event');

    $this->assertDatabaseHas('events', [
        'title' => 'Open House Sekolah',
        'location' => 'Kampus Lantaburo',
        'contact_person' => 'Budi Santoso',
        'phone' => '08123456789',
    ]);
});

test('admin cannot create an event with missing required fields', function () {
    $admin = adminEventUser();

    $this->actingAs($admin)
        ->post('/admin/event', [
            'title' => '',
            'event_date' => '',
        ])
        ->assertSessionHasErrors(['title', 'event_date']);
});

test('admin can update an existing event', function () {
    $admin = adminEventUser();
    $event = Event::factory()->create([
        'title' => 'Judul Lama',
        'event_date' => now()->addDays(5)->toDateString(),
    ]);

    $this->actingAs($admin)
        ->put("/admin/event/{$event->id}", [
            'title' => 'Judul Diperbarui',
            'description' => 'Deskripsi kegiatan baru.',
            'event_date' => now()->addDays(15)->toDateString(),
            'location' => 'Aula Utama',
            'contact_person' => 'Admin Sekolah',
            'phone' => '08987654321',
        ])
        ->assertRedirect('/admin/event');

    $this->assertDatabaseHas('events', [
        'id' => $event->id,
        'title' => 'Judul Diperbarui',
        'location' => 'Aula Utama',
        'contact_person' => 'Admin Sekolah',
        'phone' => '08987654321',
    ]);
});

test('admin can delete an event', function () {
    $admin = adminEventUser();
    $event = Event::factory()->create();

    $this->actingAs($admin)
        ->delete("/admin/event/{$event->id}")
        ->assertRedirect('/admin/event');

    $this->assertDatabaseMissing('events', ['id' => $event->id]);
});

test('unauthenticated user cannot access admin event routes', function () {
    $this->get('/admin/event')->assertRedirect('/login');
    $this->post('/admin/event', [])->assertRedirect('/login');
});
