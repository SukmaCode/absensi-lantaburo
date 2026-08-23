<?php

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use App\Models\Student;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.dashboard'));
    $response->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin users can visit the dashboard', function () {
    $admin = User::factory()->asAdmin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/dashboard')
        ->has('attendanceSummary')
        ->has('attendanceOverview')
        ->has('recentAttendance')
        ->has('announcements')
        ->has('weeklyTrend'));
});

test('dashboard sends aggregated attendance data to the frontend', function () {
    $admin = User::factory()->asAdmin()->create();

    $students = Student::factory()->count(3)->create();

    AttendanceStudent::factory()->create([
        'student_id' => $students[0]->id,
        'date' => today(),
        'status' => 'hadir',
        'check_in_time' => '07:00:00',
    ]);

    AttendanceStudent::factory()->create([
        'student_id' => $students[1]->id,
        'date' => today(),
        'status' => 'terlambat',
        'check_in_time' => '07:25:00',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->where('attendanceSummary.totalStudents', 3)
        ->where('attendanceSummary.hadir', 1)
        ->where('attendanceSummary.terlambat', 1)
        ->where('attendanceSummary.belumAbsen', 1)
        ->where('attendanceOverview.hadir', 1)
        ->where('attendanceOverview.terlambat', 1)
        ->where('attendanceOverview.belumAbsen', 1)
        ->where('recentAttendance.0.name', $students[1]->user->name)
        ->where('recentAttendance.0.role', 'Siswa')
        ->where('recentAttendance.0.status', 'Terlambat')
        ->where('recentAttendance.0.time', '07:25')
        ->has('weeklyTrend', 5));
});

test('dashboard sends recent announcements', function () {
    $admin = User::factory()->asAdmin()->create();

    $students = Student::factory()->count(2)->create();
    $students[0]->forceFill(['created_at' => now()->subDay()])->save();
    $students[1]->forceFill(['created_at' => now()])->save();

    $announcements = Announcement::factory()->count(2)->create();
    $announcements[0]->forceFill(['published_at' => now()->subDay()])->save();
    $announcements[1]->forceFill(['published_at' => now()])->save();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('announcements', 2)
        ->where('announcements.0.title', $announcements[1]->title));
});
