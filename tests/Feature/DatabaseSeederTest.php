<?php

use App\Models\Announcement;
use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Models\Event;
use App\Models\NotificationSetting;
use App\Models\SchoolClass;
use App\Models\SchoolProfile;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;

test('database seeder menghasilkan data dummy sesuai skala kecil', function () {
    $this->seed();

    expect(User::count())->toBe(26)
        ->and(Teacher::count())->toBe(5)
        ->and(SchoolClass::count())->toBe(4)
        ->and(Student::count())->toBe(20)
        ->and(SchoolProfile::count())->toBe(1)
        ->and(NotificationSetting::count())->toBe(26)
        ->and(Announcement::count())->toBe(5)
        ->and(Event::count())->toBe(3)
        ->and(AttendanceStudent::count())->toBeGreaterThan(0)
        ->and(AttendanceTeacher::count())->toBeGreaterThan(0);
});
