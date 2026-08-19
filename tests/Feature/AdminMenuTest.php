<?php

use App\Models\User;

test('guests are redirected to the login page on admin menu pages', function () {
    foreach (['dashboard', 'absensi', 'data-siswa', 'data-guru', 'pengumuman'] as $route) {
        $response = $this->get(route($route));
        $response->assertRedirect(route('login'));
    }
});

test('non-admin users are forbidden from admin menu pages', function () {
    $user = User::factory()->create();

    foreach (['dashboard', 'absensi', 'data-siswa', 'data-guru', 'pengumuman'] as $route) {
        $this->actingAs($user)
            ->get(route($route))
            ->assertForbidden();
    }
});

test('authenticated admin users can visit admin menu pages', function () {
    $user = User::factory()->asAdmin()->create();
    $this->actingAs($user);

    foreach (['dashboard', 'absensi', 'data-siswa', 'data-guru', 'pengumuman'] as $route) {
        $response = $this->get(route($route));
        $response->assertOk();
    }
});
