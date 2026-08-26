<?php

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from guru pengaturan page', function () {
    $this->get(route('guru.pengaturan'))->assertRedirect(route('login'));
});

test('non-guru users are forbidden from guru pengaturan page', function () {
    $student = Student::factory()->create();

    $this->actingAs($student->user)
        ->get(route('guru.pengaturan'))
        ->assertForbidden();
});

test('guru can visit pengaturan page and see teacher data and homeroom class', function () {
    $teacher = Teacher::factory()->create([
        'nip' => '198501012010011001',
        'subject' => 'Matematika',
    ]);
    $class = SchoolClass::factory()->create([
        'name' => 'Kelas 7A',
        'grade_level' => '7',
        'homeroom_teacher_id' => $teacher->id,
    ]);

    $response = $this->actingAs($teacher->user)->get(route('guru.pengaturan'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('guru/pengaturan')
        ->has('teacher')
        ->where('teacher.nip', '198501012010011001')
        ->where('teacher.subject', 'Matematika')
        ->where('teacher.homeroomClass.name', 'Kelas 7A')
        ->has('user')
        ->where('user.name', $teacher->user->name)
        ->where('user.email', $teacher->user->email));
});

test('guru can update teacher and user profile fields', function () {
    $teacher = Teacher::factory()->create([
        'nip' => '198501012010011001',
        'subject' => 'Matematika',
    ]);

    $payload = [
        'name' => 'Ust. Budi Santoso, M.Pd.',
        'email' => 'budi.santoso@lantaburo.sch.id',
        'phone' => '081234567890',
        'nip' => '198501012010011099',
        'subject' => 'Bahasa Arab',
    ];

    $response = $this->actingAs($teacher->user)->post(route('guru.pengaturan.update'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'profile-updated');

    $teacher->refresh();
    $user = $teacher->user->fresh();

    expect($user->name)->toBe('Ust. Budi Santoso, M.Pd.')
        ->and($user->email)->toBe('budi.santoso@lantaburo.sch.id')
        ->and($user->phone)->toBe('081234567890')
        ->and($teacher->nip)->toBe('198501012010011099')
        ->and($teacher->subject)->toBe('Bahasa Arab');
});

test('guru cannot update profile with existing email from another user', function () {
    $otherUser = User::factory()->asGuru()->create(['email' => 'existing.teacher@lantaburo.sch.id']);
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($teacher->user)->post(route('guru.pengaturan.update'), [
        'name' => 'Guru Baru',
        'email' => 'existing.teacher@lantaburo.sch.id',
        'nip' => '198501012010011001',
        'subject' => 'IPA',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('guru cannot update profile with existing nip from another teacher', function () {
    Teacher::factory()->create(['nip' => '198501012010011001']);
    $myTeacher = Teacher::factory()->create(['nip' => '199002022015022002']);

    $response = $this->actingAs($myTeacher->user)->post(route('guru.pengaturan.update'), [
        'name' => 'Guru Saya',
        'email' => 'gurusaya@lantaburo.sch.id',
        'nip' => '198501012010011001',
        'subject' => 'IPA',
    ]);

    $response->assertSessionHasErrors(['nip']);
});

test('guru can upload and remove profile photo', function () {
    Storage::fake('public');
    $teacher = Teacher::factory()->create();

    $file = UploadedFile::fake()->image('guru_avatar.jpg');

    $response = $this->actingAs($teacher->user)->post(route('guru.pengaturan.update'), [
        'name' => $teacher->user->name,
        'email' => $teacher->user->email,
        'photo' => $file,
        'nip' => $teacher->nip,
        'subject' => $teacher->subject,
    ]);

    $response->assertRedirect();
    $user = $teacher->user->fresh();
    expect($user->photo)->not->toBeNull();
    Storage::disk('public')->assertExists($user->photo);

    // Remove photo test
    $removeResponse = $this->actingAs($teacher->user)->post(route('guru.pengaturan.update'), [
        'name' => $teacher->user->name,
        'email' => $teacher->user->email,
        'remove_photo' => true,
        'nip' => $teacher->nip,
        'subject' => $teacher->subject,
    ]);

    $removeResponse->assertRedirect();
    $userAfterRemove = $teacher->user->fresh();
    expect($userAfterRemove->photo)->toBeNull();
});

test('guru can update password from pengaturan page', function () {
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($teacher->user)->put(route('guru.pengaturan.password'), [
        'current_password' => 'password',
        'password' => 'new-teacher-password-123',
        'password_confirmation' => 'new-teacher-password-123',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'password-updated');

    $user = $teacher->user->fresh();
    expect(Hash::check('new-teacher-password-123', $user->password))->toBeTrue();
});

test('guru cannot update password with incorrect current password', function () {
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($teacher->user)->put(route('guru.pengaturan.password'), [
        'current_password' => 'wrong-password',
        'password' => 'new-teacher-password-123',
        'password_confirmation' => 'new-teacher-password-123',
    ]);

    $response->assertSessionHasErrors(['current_password']);
});
