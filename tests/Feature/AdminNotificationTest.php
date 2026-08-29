<?php

use App\Models\Payment;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('unauthenticated users are redirected from admin notifications endpoint', function () {
    $this->getJson(route('admin.notifications'))
        ->assertUnauthorized();
});

test('non-admin users cannot access admin notifications endpoint', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson(route('admin.notifications'))
        ->assertForbidden();
});

test('admin can access notifications endpoint and get json response', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->getJson(route('admin.notifications'))
        ->assertOk()
        ->assertJsonStructure([
            'notifications',
            'count',
        ]);
});

test('notifications endpoint returns paid registration payments from siswa users', function () {
    $admin = User::factory()->asAdmin()->create();

    // Siswa dengan pembayaran registrasi lunas
    $siswa = User::factory()->asSiswa()->create([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
    ]);
    Student::factory()->create([
        'user_id' => $siswa->id,
        'parent_name' => 'Pak Budi',
        'parent_phone' => '08123456789',
    ]);
    Payment::factory()->create([
        'user_id' => $siswa->id,
        'type' => 'registration',
        'status' => 'settlement',
        'amount' => 500000,
    ]);

    $response = $this->actingAs($admin)
        ->getJson(route('admin.notifications'))
        ->assertOk();

    $notifications = $response->json('notifications');

    expect($notifications)->toHaveCount(1);
    expect($notifications[0])->toMatchArray([
        'name' => 'Budi Santoso',
        'email' => 'budi@example.com',
        'parent_name' => 'Pak Budi',
        'parent_phone' => '08123456789',
    ]);
    expect($response->json('count'))->toBe(1);
});

test('notifications endpoint excludes users without paid registration payment', function () {
    $admin = User::factory()->asAdmin()->create();

    // Siswa dengan pembayaran PENDING – tidak boleh muncul
    $siswa = User::factory()->asSiswa()->create();
    Student::factory()->create(['user_id' => $siswa->id]);
    Payment::factory()->create([
        'user_id' => $siswa->id,
        'type' => 'registration',
        'status' => 'pending',
        'amount' => 500000,
    ]);

    $response = $this->actingAs($admin)
        ->getJson(route('admin.notifications'))
        ->assertOk();

    expect($response->json('notifications'))->toHaveCount(0);
});

test('notifications endpoint excludes calon_siswa role users', function () {
    $admin = User::factory()->asAdmin()->create();

    // calon_siswa dengan pembayaran lunas – tidak boleh muncul di notifikasi
    $calonSiswa = User::factory()->create(['role' => 'calon_siswa']);
    Payment::factory()->create([
        'user_id' => $calonSiswa->id,
        'type' => 'registration',
        'status' => 'settlement',
        'amount' => 500000,
    ]);

    $response = $this->actingAs($admin)
        ->getJson(route('admin.notifications'))
        ->assertOk();

    expect($response->json('notifications'))->toHaveCount(0);
});
