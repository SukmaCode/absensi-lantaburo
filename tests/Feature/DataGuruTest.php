<?php

use App\Models\Teacher;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page on data guru', function () {
    $this->get(route('admin.data-guru'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the data guru page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.data-guru'))
        ->assertForbidden();
});

test('admin users can visit the data guru page', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->get(route('admin.data-guru'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/data-guru')
            ->has('teachers')
            ->has('pagination'));
});

test('data guru page paginates teachers', function () {
    $admin = User::factory()->asAdmin()->create();
    Teacher::factory()->count(15)->create();

    $this->actingAs($admin)->get(route('admin.data-guru'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('teachers', 5)
            ->where('pagination.current_page', 1)
            ->where('pagination.last_page', 3)
            ->where('pagination.total', 15)
            ->where('pagination.links.0.url', null)
            ->where('pagination.links.1.active', true)
            ->whereNot('pagination.links.4.url', null));

    $this->actingAs($admin)->get(route('admin.data-guru', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('teachers', 5)
            ->where('pagination.current_page', 2)
            ->where('pagination.last_page', 3)
            ->where('pagination.links.2.active', true)
            ->whereNot('pagination.links.0.url', null));
});

test('data guru page maps teacher preview fields', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();

    $this->actingAs($admin)->get(route('admin.data-guru'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('teachers.0.name', $teacher->user->name)
            ->where('teachers.0.nip', $teacher->nip)
            ->where('teachers.0.phone', $teacher->user->phone)
            ->where('teachers.0.status', 'Aktif')
            ->where('teachers.0.avatar', null));
});
