<?php

use App\Models\SchoolClass;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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
            ->where('teachers.0.id', $teacher->id)
            ->where('teachers.0.name', $teacher->user->name)
            ->where('teachers.0.email', $teacher->user->email)
            ->where('teachers.0.nip', $teacher->nip)
            ->where('teachers.0.subject', $teacher->subject)
            ->where('teachers.0.phone', $teacher->user->phone)
            ->where('teachers.0.status', 'Aktif')
            ->where('teachers.0.raw_status', 'active')
            ->where('teachers.0.avatar', null));
});

test('admin can update an existing teacher', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacherUser = User::factory()->asGuru()->create();
    $teacher = Teacher::factory()->create([
        'user_id' => $teacherUser->id,
        'nip' => '198501012010011001',
        'subject' => 'Matematika',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-guru.update', $teacher->id), [
            'name' => 'Budi Santoso, S.Pd.',
            'email' => 'budi.santoso@example.com',
            'phone' => '081234567890',
            'nip' => '198501012010011002',
            'subject' => 'Fisika',
            'status' => 'inactive',
        ])
        ->assertRedirect(route('admin.data-guru'))
        ->assertSessionHas('success', 'Data guru berhasil diperbarui.');

    $teacher->refresh();
    $teacherUser->refresh();

    expect($teacherUser->name)->toBe('Budi Santoso, S.Pd.')
        ->and($teacherUser->email)->toBe('budi.santoso@example.com')
        ->and($teacherUser->phone)->toBe('081234567890')
        ->and($teacherUser->status)->toBe('inactive')
        ->and($teacher->nip)->toBe('198501012010011002')
        ->and($teacher->subject)->toBe('Fisika');
});

test('admin can update a teacher with a new password', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacherUser = User::factory()->asGuru()->create(['password' => 'old-password']);
    $teacher = Teacher::factory()->create(['user_id' => $teacherUser->id]);

    $this->actingAs($admin)
        ->put(route('admin.data-guru.update', $teacher->id), [
            'name' => $teacherUser->name,
            'email' => $teacherUser->email,
            'nip' => $teacher->nip,
            'subject' => $teacher->subject,
            'status' => 'active',
            'password' => 'new-secret-password-123',
        ])
        ->assertRedirect(route('admin.data-guru'));

    $teacherUser->refresh();
    expect(Hash::check('new-secret-password-123', $teacherUser->password))->toBeTrue();
});

test('admin cannot update a teacher with duplicate email or nip', function () {
    $admin = User::factory()->asAdmin()->create();
    $otherUser = User::factory()->asGuru()->create(['email' => 'other@example.com']);
    Teacher::factory()->create([
        'user_id' => $otherUser->id,
        'nip' => '1234567890',
    ]);

    $teacherUser = User::factory()->asGuru()->create(['email' => 'teacher@example.com']);
    $teacher = Teacher::factory()->create([
        'user_id' => $teacherUser->id,
        'nip' => '0987654321',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-guru.update', $teacher->id), [
            'name' => 'Name',
            'email' => 'other@example.com',
            'nip' => '1234567890',
            'subject' => 'Math',
            'status' => 'active',
        ])
        ->assertSessionHasErrors(['email', 'nip']);
});

test('non-admin cannot update a teacher', function () {
    $teacher = Teacher::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->put(route('admin.data-guru.update', $teacher->id), [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'nip' => '12345',
            'subject' => 'Biology',
            'status' => 'active',
        ])
        ->assertForbidden();
});

test('guests are redirected when attempting to update a teacher', function () {
    $teacher = Teacher::factory()->create();

    $this->put(route('admin.data-guru.update', $teacher->id), [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'nip' => '12345',
        'subject' => 'Biology',
        'status' => 'active',
    ])
        ->assertRedirect(route('login'));
});

test('admin can delete a teacher and it unlinks homeroom_teacher_id in classes', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacherUser = User::factory()->asGuru()->create();
    $teacher = Teacher::factory()->create(['user_id' => $teacherUser->id]);

    $class = SchoolClass::factory()->create([
        'homeroom_teacher_id' => $teacher->id,
    ]);

    expect($class->fresh()->homeroom_teacher_id)->toBe($teacher->id);

    $this->actingAs($admin)
        ->delete(route('admin.data-guru.destroy', $teacher->id))
        ->assertRedirect(route('admin.data-guru'))
        ->assertSessionHas('success', 'Data guru berhasil dihapus.');

    $this->assertDatabaseMissing('teachers', ['id' => $teacher->id]);
    $this->assertDatabaseMissing('users', ['id' => $teacherUser->id]);

    expect($class->fresh()->homeroom_teacher_id)->toBeNull();
});

test('non-admin cannot delete a teacher', function () {
    $teacher = Teacher::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.data-guru.destroy', $teacher->id))
        ->assertForbidden();

    $this->assertDatabaseHas('teachers', ['id' => $teacher->id]);
});

test('guests are redirected when attempting to delete a teacher', function () {
    $teacher = Teacher::factory()->create();

    $this->delete(route('admin.data-guru.destroy', $teacher->id))
        ->assertRedirect(route('login'));

    $this->assertDatabaseHas('teachers', ['id' => $teacher->id]);
});
