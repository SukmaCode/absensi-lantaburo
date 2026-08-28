<?php

use App\Models\AttendanceStudent;
use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from orangtua routes', function () {
    $this->get(route('orangtua.dashboard'))->assertRedirect(route('login'));
    $this->get(route('orangtua.absen-anak'))->assertRedirect(route('login'));
    $this->get(route('orangtua.pengaturan'))->assertRedirect(route('login'));
});

test('non-orangtua users are forbidden from orangtua routes', function () {
    $teacher = Teacher::factory()->create();

    $this->actingAs($teacher->user)
        ->get(route('orangtua.dashboard'))
        ->assertForbidden();
});

test('orangtua user is redirected to orangtua dashboard on login', function () {
    $user = User::factory()->asOrangTua()->create([
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('orangtua.dashboard'));
});

test('orangtua can visit dashboard', function () {
    $parent = ParentProfile::factory()->create();
    $student = Student::factory()->create(['parent_id' => $parent->id]);

    $response = $this->actingAs($parent->user)->get(route('orangtua.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('orangtua/dashboard')
        ->where('hasChildren', true)
        ->has('children', 1)
        ->has('announcements'));
});

test('orangtua dashboard shows today attendance and monthly stats correctly', function () {
    $parent = ParentProfile::factory()->create();
    $student = Student::factory()->create(['parent_id' => $parent->id]);

    AttendanceStudent::factory()->create([
        'student_id' => $student->id,
        'date' => today(),
        'check_in_time' => '07:15:00',
        'status' => 'hadir',
        'photo_selfie' => 'selfies/students/test.jpg',
    ]);

    $response = $this->actingAs($parent->user)->get(route('orangtua.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('orangtua/dashboard')
        ->where('hasChildren', true)
        ->where('children.0.todayAttendance.hasAttended', true)
        ->where('children.0.todayAttendance.status', 'hadir')
        ->where('children.0.monthlyStats.hadir', 1));
});

test('orangtua can visit absen anak page', function () {
    $parent = ParentProfile::factory()->create();
    $student = Student::factory()->create(['parent_id' => $parent->id]);

    $response = $this->actingAs($parent->user)->get(route('orangtua.absen-anak'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('orangtua/absen-anak')
        ->where('hasChildren', true)
        ->has('daysInMonth')
        ->has('dailySummary')
        ->has('summary'));
});

test('orangtua absen anak filters by month and specific child', function () {
    $parent = ParentProfile::factory()->create();
    $student1 = Student::factory()->create(['parent_id' => $parent->id]);
    $student2 = Student::factory()->create(['parent_id' => $parent->id]);

    AttendanceStudent::factory()->create([
        'student_id' => $student2->id,
        'date' => now()->subMonth()->startOfMonth()->toDateString(),
        'status' => 'hadir',
        'check_in_time' => '07:00:00',
    ]);

    $lastMonth = now()->subMonth()->format('Y-m');

    $response = $this->actingAs($parent->user)->get(route('orangtua.absen-anak', [
        'month' => $lastMonth,
        'student_id' => $student2->id,
    ]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('orangtua/absen-anak')
        ->where('selectedMonth', $lastMonth)
        ->where('selectedStudent.id', $student2->id)
        ->where('summary.hadir', 1));
});

test('orangtua can visit pengaturan page', function () {
    $parent = ParentProfile::factory()->create();

    $response = $this->actingAs($parent->user)->get(route('orangtua.pengaturan'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('orangtua/pengaturan')
        ->has('user'));
});

test('orangtua can update account profile', function () {
    $parent = ParentProfile::factory()->create();

    $payload = [
        'name' => 'Bapak Budi Santoso',
        'email' => 'budi.santoso@example.com',
        'phone' => '081299998888',
    ];

    $response = $this->actingAs($parent->user)->post(route('orangtua.pengaturan.update'), $payload);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'profile-updated');

    $user = $parent->user->fresh();
    expect($user->name)->toBe('Bapak Budi Santoso');
    expect($user->email)->toBe('budi.santoso@example.com');
    expect($user->phone)->toBe('081299998888');
});

test('orangtua can update password', function () {
    $parent = ParentProfile::factory()->create();

    $response = $this->actingAs($parent->user)->put(route('orangtua.pengaturan.password'), [
        'current_password' => 'password',
        'password' => 'new-parent-password',
        'password_confirmation' => 'new-parent-password',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status', 'password-updated');

    $user = $parent->user->fresh();
    expect(Hash::check('new-parent-password', $user->password))->toBeTrue();
});
