<?php

use App\Models\AttendanceStudent;
use App\Models\AttendanceTeacher;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from guru routes', function () {
    $this->get(route('guru.dashboard'))->assertRedirect(route('login'));
    $this->get(route('guru.absen'))->assertRedirect(route('login'));
    $this->get(route('guru.absen-murid'))->assertRedirect(route('login'));
    $this->get(route('guru.rekap-murid'))->assertRedirect(route('login'));
});

test('non-guru users are forbidden from guru routes', function () {
    $studentUser = User::factory()->asSiswa()->create();

    $this->actingAs($studentUser)
        ->get(route('guru.dashboard'))
        ->assertForbidden();
});

test('guru can visit guru dashboard', function () {
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($teacher->user)->get(route('guru.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('guru/dashboard')
        ->has('teacherInfo')
        ->has('todaySelfAttendance')
        ->has('announcements'));
});

test('guru dashboard displays homeroom class student attendance statistics', function () {
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create(['homeroom_teacher_id' => $teacher->id]);
    $students = Student::factory()->count(3)->create(['class_id' => $class->id]);

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
        'check_in_time' => '07:35:00',
    ]);

    $response = $this->actingAs($teacher->user)->get(route('guru.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->where('homeroomClass.id', $class->id)
        ->where('studentSummary.totalStudents', 3)
        ->where('studentSummary.hadir', 1)
        ->where('studentSummary.terlambat', 1)
        ->where('studentSummary.belumAbsen', 1)
        ->where('studentSummary.attendanceRate', 67));
});

test('guru can visit self attendance page', function () {
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($teacher->user)->get(route('guru.absen'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('guru/absen')
        ->has('todayAttendance')
        ->has('currentTime')
        ->has('currentDate'));
});

test('guru can submit self attendance with selfie and GPS', function () {
    Storage::fake('public');
    $teacher = Teacher::factory()->create();

    $file = UploadedFile::fake()->image('selfie.jpg');

    $response = $this->actingAs($teacher->user)->post(route('guru.absen.store'), [
        'photo_selfie' => $file,
        'latitude' => -6.2088,
        'longitude' => 106.8456,
        'notes' => 'Presensi pagi',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $record = AttendanceTeacher::where('teacher_id', $teacher->id)->first();
    expect($record)->not->toBeNull()
        ->and((float) $record->latitude)->toBe(-6.2088)
        ->and((float) $record->longitude)->toBe(106.8456)
        ->and($record->notes)->toBe('Presensi pagi')
        ->and($record->photo_selfie)->not->toBeNull();
});

test('guru can view homeroom students on student attendance page', function () {
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create(['homeroom_teacher_id' => $teacher->id]);
    $students = Student::factory()->count(4)->create(['class_id' => $class->id]);

    $response = $this->actingAs($teacher->user)->get(route('guru.absen-murid'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('guru/absen-murid')
        ->where('hasHomeroomClass', true)
        ->has('students', 4)
        ->where('classInfo.name', $class->name));
});

test('guru can save batch student attendance for homeroom class', function () {
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create(['homeroom_teacher_id' => $teacher->id]);
    $students = Student::factory()->count(2)->create(['class_id' => $class->id]);

    $response = $this->actingAs($teacher->user)->post(route('guru.absen-murid.store'), [
        'date' => today()->toDateString(),
        'attendances' => [
            [
                'student_id' => $students[0]->id,
                'status' => 'hadir',
                'notes' => null,
            ],
            [
                'student_id' => $students[1]->id,
                'status' => 'izin',
                'notes' => 'Ada acara keluarga',
            ],
        ],
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $att0 = AttendanceStudent::where('student_id', $students[0]->id)->first();
    expect($att0)->not->toBeNull()->and($att0->status)->toBe('hadir');

    $att1 = AttendanceStudent::where('student_id', $students[1]->id)->first();
    expect($att1)->not->toBeNull()
        ->and($att1->status)->toBe('izin')
        ->and($att1->notes)->toBe('Ada acara keluarga');
});

test('guru cannot submit attendance for students from another class', function () {
    $teacher = Teacher::factory()->create();
    $myClass = SchoolClass::factory()->create(['homeroom_teacher_id' => $teacher->id]);
    $otherClass = SchoolClass::factory()->create();

    $otherStudent = Student::factory()->create(['class_id' => $otherClass->id]);

    $response = $this->actingAs($teacher->user)->post(route('guru.absen-murid.store'), [
        'date' => today()->toDateString(),
        'attendances' => [
            [
                'student_id' => $otherStudent->id,
                'status' => 'hadir',
                'notes' => null,
            ],
        ],
    ]);

    $response->assertSessionHasErrors('attendances.0.student_id');
});

test('guru can view monthly recap for homeroom class', function () {
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create(['homeroom_teacher_id' => $teacher->id]);
    $students = Student::factory()->count(2)->create(['class_id' => $class->id]);

    AttendanceStudent::factory()->create([
        'student_id' => $students[0]->id,
        'date' => today(),
        'status' => 'hadir',
    ]);

    $response = $this->actingAs($teacher->user)->get(route('guru.rekap-murid'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('guru/rekap-murid')
        ->where('hasHomeroomClass', true)
        ->has('students', 2)
        ->has('daysInMonth')
        ->has('summary'));
});
