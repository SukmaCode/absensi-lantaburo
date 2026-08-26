<?php

use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('calon-siswa.dashboard', absolute: false));
});

test('registration with explicit calon_siswa role is accepted', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Calon Siswa User',
        'email' => 'calon@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'calon_siswa',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('calon-siswa.dashboard', absolute: false));
});

test('registration fails when role is manipulated to admin or other unauthorized roles', function (string $unauthorizedRole) {
    $response = $this->post(route('register.store'), [
        'name' => 'Attacker',
        'email' => 'attacker@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => $unauthorizedRole,
    ]);

    $response->assertSessionHasErrors(['role']);
    $this->assertGuest();
})->with(['admin', 'guru', 'siswa', 'superadmin', 'unknown_role']);
