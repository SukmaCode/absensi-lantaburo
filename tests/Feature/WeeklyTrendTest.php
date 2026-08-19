<?php

use App\Models\AttendanceStudent;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('weekly trend compares each day with the same weekday last week', function () {
    $this->travelTo('2026-08-19 09:00:00');

    $class = SchoolClass::create([
        'name' => 'XII IPA 1',
        'grade_level' => 'XII',
        'homeroom_teacher_id' => null,
    ]);

    $users = User::factory()->count(2)->create(['role' => 'siswa']);

    $students = $users->map(
        fn (User $user) => Student::factory()->create([
            'user_id' => $user->id,
            'class_id' => $class->id,
        ])
    );

    foreach ($students as $student) {
        AttendanceStudent::factory()->create([
            'student_id' => $student->id,
            'date' => '2026-08-19',
            'status' => 'hadir',
            'check_in_time' => '07:00:00',
        ]);
    }

    AttendanceStudent::factory()->create([
        'student_id' => $students[0]->id,
        'date' => '2026-08-12',
        'status' => 'hadir',
        'check_in_time' => '07:00:00',
    ]);

    $trend = app(DashboardService::class)->dashboardData()['weeklyTrend'];

    expect($trend)->toHaveCount(5);

    $todayEntry = collect($trend)->firstWhere('today', true);

    expect($todayEntry['day'])->toBe('Rabu');
    expect($todayEntry['value'])->toBe(2);
    expect($todayEntry['last_value'])->toBe(1);
    expect($todayEntry['current_week']['total'])->toBe(2);
    expect($todayEntry['last_week']['total'])->toBe(1);
});
