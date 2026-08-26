<?php

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from admin pengaturan page', function () {
    $this->get(route('admin.pengaturan'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from admin pengaturan page', function () {
    $student = Student::factory()->create();

    $this->actingAs($student->user)
        ->get(route('admin.pengaturan'))
        ->assertForbidden();

    $teacher = Teacher::factory()->create();

    $this->actingAs($teacher->user)
        ->get(route('admin.pengaturan'))
        ->assertForbidden();
});

test('admin can visit pengaturan page and see profile data and system stats', function () {
    $admin = User::factory()->asAdmin()->create([
        'name' => 'Administrator Utama',
        'email' => 'admin.test@lantaburo.sch.id',
        'phone' => '081234567890',
    ]);

    Teacher::factory()->count(2)->create();
    Student::factory()->count(3)->create();
    SchoolClass::factory()->count(2)->create();

    $expectedTeachersCount = Teacher::count();
    $expectedStudentsCount = Student::count();
    $expectedClassesCount = SchoolClass::count();

    $response = $this->actingAs($admin)->get(route('admin.pengaturan'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/pengaturan')
        ->has('user')
        ->where('user.name', 'Administrator Utama')
        ->where('user.email', 'admin.test@lantaburo.sch.id')
        ->where('user.phone', '081234567890')
        ->has('systemStats')
        ->where('systemStats.totalTeachers', $expectedTeachersCount)
        ->where('systemStats.totalStudents', $expectedStudentsCount)
        ->where('systemStats.totalClasses', $expectedClassesCount));
});

test('admin can update profile fields', function () {
    $admin = User::factory()->asAdmin()->create([
        'name' => 'Admin Awal',
        'email' => 'admin.awal@lantaburo.sch.id',
    ]);

    $payload = [
        'name' => 'Admin Baru Diperbarui',
        'email' => 'admin.baru@lantaburo.sch.id',
        'phone' => '089876543210',
    ];

    $response = $this->actingAs($admin)->post(route('admin.pengaturan.update'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'profile-updated');

    $admin->refresh();

    expect($admin->name)->toBe('Admin Baru Diperbarui')
        ->and($admin->email)->toBe('admin.baru@lantaburo.sch.id')
        ->and($admin->phone)->toBe('089876543210');
});

test('admin cannot update profile with existing email from another user', function () {
    User::factory()->create(['email' => 'existing.user@lantaburo.sch.id']);
    $admin = User::factory()->asAdmin()->create();

    $response = $this->actingAs($admin)->post(route('admin.pengaturan.update'), [
        'name' => 'Admin Lain',
        'email' => 'existing.user@lantaburo.sch.id',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('admin can upload and remove profile photo', function () {
    Storage::fake('public');
    $admin = User::factory()->asAdmin()->create();

    $file = UploadedFile::fake()->image('admin_avatar.jpg');

    $response = $this->actingAs($admin)->post(route('admin.pengaturan.update'), [
        'name' => $admin->name,
        'email' => $admin->email,
        'photo' => $file,
    ]);

    $response->assertRedirect();
    $admin->refresh();
    expect($admin->photo)->not->toBeNull();
    Storage::disk('public')->assertExists($admin->photo);

    // Remove photo test
    $removeResponse = $this->actingAs($admin)->post(route('admin.pengaturan.update'), [
        'name' => $admin->name,
        'email' => $admin->email,
        'remove_photo' => true,
    ]);

    $removeResponse->assertRedirect();
    $admin->refresh();
    expect($admin->photo)->toBeNull();
});

test('admin can update password from pengaturan page', function () {
    $admin = User::factory()->asAdmin()->create([
        'password' => Hash::make('old-password-123'),
    ]);

    $response = $this->actingAs($admin)->put(route('admin.pengaturan.password'), [
        'current_password' => 'old-password-123',
        'password' => 'new-admin-password-456',
        'password_confirmation' => 'new-admin-password-456',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'password-updated');

    $admin->refresh();
    expect(Hash::check('new-admin-password-456', $admin->password))->toBeTrue();
});

test('admin cannot update password with incorrect current password', function () {
    $admin = User::factory()->asAdmin()->create([
        'password' => Hash::make('correct-password-123'),
    ]);

    $response = $this->actingAs($admin)->put(route('admin.pengaturan.password'), [
        'current_password' => 'wrong-password',
        'password' => 'new-admin-password-456',
        'password_confirmation' => 'new-admin-password-456',
    ]);

    $response->assertSessionHasErrors(['current_password']);
});
