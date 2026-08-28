<?php

use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page on absensi', function () {
    $this->get(route('admin.absensi'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the absensi page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.absensi'))
        ->assertForbidden();
});

test('admin users can visit the absensi page', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->get(route('admin.absensi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/absensi')
            ->has('studentAttendances')
            ->has('teacherAttendances'));
});

test('absensi page shows student attendance recap', function () {
    $admin = User::factory()->asAdmin()->create();
    $student = Student::factory()->create();

    AttendanceStudent::factory()->create([
        'student_id' => $student->id,
        'date' => '2026-08-21',
        'check_in_time' => '07:10:00',
        'status' => 'hadir',
    ]);

    $this->actingAs($admin)->get(route('admin.absensi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('studentAttendances.data', 1)
            ->where('studentAttendances.data.0.name', $student->user->name)
            ->where('studentAttendances.data.0.date', '21-08-2026')
            ->where('studentAttendances.data.0.time', '07:10')
            ->where('studentAttendances.data.0.status', 'Hadir'));
});

test('absensi page shows teacher attendance recap', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();

    AttendanceTeacher::factory()->create([
        'teacher_id' => $teacher->id,
        'date' => '2026-08-21',
        'check_in_time' => '07:25:00',
        'status' => 'terlambat',
        'photo_selfie' => 'attendance/teacher/photo.jpg',
    ]);

    $this->actingAs($admin)->get(route('admin.absensi'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('teacherAttendances.data', 1)
            ->where('teacherAttendances.data.0.name', $teacher->user->name)
            ->where('teacherAttendances.data.0.time', '07:25')
            ->where('teacherAttendances.data.0.status', 'Terlambat')
            ->where('teacherAttendances.data.0.photo_url', asset('storage/attendance/teacher/photo.jpg')));
});
