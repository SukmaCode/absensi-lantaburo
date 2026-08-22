<?php

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

function adminUser(): User
{
    return User::factory()->create(['role' => 'admin', 'status' => 'active']);
}

test('admin can view the pengumuman index page', function () {
    $admin = adminUser();

    Announcement::factory()->count(3)->create(['created_by' => $admin->id]);

    $this->actingAs($admin)
        ->get('/admin/pengumuman')
        ->assertOk()
        ->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('admin/pengumuman')
                ->has('announcements', 3)
                ->has('pagination'),
        );
});

test('admin can create a new announcement', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post('/admin/pengumuman', [
            'title' => 'Pengumuman Libur Nasional',
            'content' => 'Sekolah libur pada tanggal 17 Agustus.',
            'target_role' => 'all',
            'published_at' => now()->toDateTimeString(),
        ])
        ->assertRedirect('/admin/pengumuman');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Pengumuman Libur Nasional',
        'target_role' => 'all',
        'created_by' => $admin->id,
    ]);
});

test('admin cannot create an announcement with missing required fields', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post('/admin/pengumuman', [
            'title' => '',
            'content' => '',
            'target_role' => '',
        ])
        ->assertSessionHasErrors(['title', 'content', 'target_role']);
});

test('admin can update an existing announcement', function () {
    $admin = adminUser();
    $announcement = Announcement::factory()->create(['created_by' => $admin->id]);

    $this->actingAs($admin)
        ->put("/admin/pengumuman/{$announcement->id}", [
            'title' => 'Judul Diperbarui',
            'content' => 'Isi pengumuman diperbarui.',
            'target_role' => 'guru',
        ])
        ->assertRedirect('/admin/pengumuman');

    $this->assertDatabaseHas('announcements', [
        'id' => $announcement->id,
        'title' => 'Judul Diperbarui',
        'target_role' => 'guru',
    ]);
});

test('admin can delete an announcement', function () {
    $admin = adminUser();
    $announcement = Announcement::factory()->create(['created_by' => $admin->id]);

    $this->actingAs($admin)
        ->delete("/admin/pengumuman/{$announcement->id}")
        ->assertRedirect('/admin/pengumuman');

    $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
});

test('unauthenticated user cannot access pengumuman routes', function () {
    $this->get('/admin/pengumuman')->assertRedirect('/login');
    $this->post('/admin/pengumuman', [])->assertRedirect('/login');
});
