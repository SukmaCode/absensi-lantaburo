<?php

use App\Models\AttendanceStudent;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from siswa routes', function () {
    $this->get(route('siswa.dashboard'))->assertRedirect(route('login'));
    $this->get(route('siswa.absen'))->assertRedirect(route('login'));
    $this->get(route('siswa.riwayat'))->assertRedirect(route('login'));
});

test('non-siswa users are forbidden from siswa routes', function () {
    $teacher = Teacher::factory()->create();

    $this->actingAs($teacher->user)
        ->get(route('siswa.dashboard'))
        ->assertForbidden();
});

test('siswa can visit siswa dashboard', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->get(route('siswa.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/dashboard')
        ->has('studentInfo')
        ->has('todaySelfie')
        ->has('monthlyStats')
        ->has('recentHistory')
        ->has('announcements'));
});

test('siswa dashboard shows no selfie uploaded today when no record exists', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->get(route('siswa.dashboard'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/dashboard')
        ->where('todaySelfie.hasUploaded', false));
});

test('siswa dashboard shows selfie uploaded when record exists', function () {
    $student = Student::factory()->create();

    AttendanceStudent::factory()->create([
        'student_id' => $student->id,
        'date' => today(),
        'check_in_time' => '07:05:00',
        'photo_selfie' => 'selfies/students/test.jpg',
    ]);

    $response = $this->actingAs($student->user)->get(route('siswa.dashboard'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/dashboard')
        ->where('todaySelfie.hasUploaded', true)
        ->where('todaySelfie.checkInTime', '07:05'));
});

test('siswa can visit absen page', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->get(route('siswa.absen'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/absen')
        ->has('todayAttendance')
        ->has('currentTime')
        ->has('currentDate'));
});

test('siswa can submit selfie attendance', function () {
    Storage::fake('public');

    $student = Student::factory()->create();

    $base64Photo = 'data:image/jpeg;base64,'.base64_encode('fake-image-content');

    $response = $this->actingAs($student->user)->post(route('siswa.absen.store'), [
        'photo_selfie' => $base64Photo,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('attendance_students', [
        'student_id' => $student->id,
    ]);

    $this->assertTrue(
        AttendanceStudent::where('student_id', $student->id)
            ->whereDate('date', today())
            ->exists()
    );
});

test('siswa cannot submit attendance without selfie', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->post(route('siswa.absen.store'), [
        'photo_selfie' => '',
    ]);

    $response->assertSessionHasErrors(['photo_selfie']);
});

test('siswa absen page shows already uploaded state when selfie exists today', function () {
    $student = Student::factory()->create();

    AttendanceStudent::factory()->create([
        'student_id' => $student->id,
        'date' => today(),
        'check_in_time' => '07:10:00',
        'photo_selfie' => 'selfies/students/test.jpg',
    ]);

    $response = $this->actingAs($student->user)->get(route('siswa.absen'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/absen')
        ->where('todayAttendance.hasUploaded', true));
});

test('siswa can visit riwayat page', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->get(route('siswa.riwayat'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/riwayat')
        ->has('selectedMonth')
        ->has('stats')
        ->has('history'));
});

test('siswa riwayat shows monthly attendance records confirmed by teacher', function () {
    $student = Student::factory()->create();

    AttendanceStudent::factory()->create([
        'student_id' => $student->id,
        'date' => today()->startOfMonth()->toDateString(),
        'status' => 'hadir',
        'check_in_time' => '07:00:00',
    ]);

    $response = $this->actingAs($student->user)->get(route('siswa.riwayat'));

    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/riwayat')
        ->where('stats.hadir', 1)
        ->has('history', 1));
});

test('siswa riwayat month filter works correctly', function () {
    $student = Student::factory()->create();

    AttendanceStudent::factory()->create([
        'student_id' => $student->id,
        'date' => now()->subMonth()->startOfMonth()->toDateString(),
        'status' => 'hadir',
        'check_in_time' => '07:00:00',
    ]);

    $lastMonth = now()->subMonth()->format('Y-m');

    $response = $this->actingAs($student->user)->get(route('siswa.riwayat', ['month' => $lastMonth]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/riwayat')
        ->where('selectedMonth', $lastMonth)
        ->has('history', 1));
});

test('siswa can visit pengaturan page', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->get(route('siswa.pengaturan'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('siswa/pengaturan')
        ->has('student')
        ->has('user')
        ->has('classes'));
});

test('siswa can update all student and user profile fields', function () {
    $student = Student::factory()->create();
    $class = SchoolClass::factory()->create();

    $payload = [
        'name' => 'Ahmad Dahlan',
        'email' => 'ahmad.dahlan@example.com',
        'phone' => '081234567890',
        'nis' => 'NIS-998877',
        'class_id' => $class->id,
        'gender' => 'L',
        'birth_date' => '2008-05-15',
        'address' => 'Jl. Merdeka No. 45, Jakarta',
        'parent_name' => 'Bapak Dahlan',
        'parent_phone' => '081987654321',
    ];

    $response = $this->actingAs($student->user)->post(route('siswa.pengaturan.update'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'profile-updated');

    $student->refresh();
    $user = $student->user->fresh();

    expect($user->name)->toBe('Ahmad Dahlan');
    expect($user->email)->toBe('ahmad.dahlan@example.com');
    expect($user->phone)->toBe('081234567890');
    expect($student->nis)->toBe('NIS-998877');
    expect($student->class_id)->toBe($class->id);
    expect($student->gender)->toBe('L');
    expect(date('Y-m-d', strtotime((string) $student->birth_date)))->toBe('2008-05-15');
    expect($student->address)->toBe('Jl. Merdeka No. 45, Jakarta');
    expect($student->parent_name)->toBe('Bapak Dahlan');
    expect($student->parent_phone)->toBe('081987654321');
});

test('siswa cannot update profile with existing nis from another student', function () {
    $otherStudent = Student::factory()->create(['nis' => 'NIS-EXISTING-123']);
    $student = Student::factory()->create(['nis' => 'NIS-MY-456']);

    $response = $this->actingAs($student->user)->post(route('siswa.pengaturan.update'), [
        'name' => 'My Name',
        'email' => 'my@example.com',
        'nis' => 'NIS-EXISTING-123',
        'gender' => 'L',
    ]);

    $response->assertSessionHasErrors(['nis']);
});

test('siswa can update password from pengaturan page', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($student->user)->put(route('siswa.pengaturan.password'), [
        'current_password' => 'password',
        'password' => 'new-password-123',
        'password_confirmation' => 'new-password-123',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'password-updated');

    $user = $student->user->fresh();
    expect(Hash::check('new-password-123', $user->password))->toBeTrue();
});
