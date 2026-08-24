<?php

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page on data kelas', function () {
    $this->get(route('admin.data-kelas'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the data kelas page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.data-kelas'))
        ->assertForbidden();
});

test('admin users can visit the data kelas page', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->get(route('admin.data-kelas'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/data-kelas')
            ->has('classes')
            ->has('teachers')
            ->has('pagination'));
});

test('data kelas page paginates classes', function () {
    $admin = User::factory()->asAdmin()->create();

    // Create 15 classes with distinct names
    foreach (range(1, 15) as $i) {
        SchoolClass::factory()->create(['name' => "Kelas $i"]);
    }

    $this->actingAs($admin)->get(route('admin.data-kelas'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('classes', 5)
            ->where('pagination.current_page', 1)
            ->where('pagination.last_page', 3)
            ->where('pagination.total', 15)
            ->where('pagination.links.0.url', null)
            ->where('pagination.links.1.active', true)
            ->whereNot('pagination.links.4.url', null));

    $this->actingAs($admin)->get(route('admin.data-kelas', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('classes', 5)
            ->where('pagination.current_page', 2)
            ->where('pagination.last_page', 3)
            ->where('pagination.links.2.active', true)
            ->whereNot('pagination.links.0.url', null));
});

test('data kelas page maps class preview fields', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create([
        'name' => 'X IPA 1',
        'grade_level' => 'X',
        'homeroom_teacher_id' => $teacher->id,
    ]);

    Student::factory()->count(3)->create(['class_id' => $class->id]);

    $this->actingAs($admin)->get(route('admin.data-kelas'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('classes.0.name', 'X IPA 1')
            ->where('classes.0.grade_level', 'X')
            ->where('classes.0.homeroom_teacher', $teacher->user->name)
            ->where('classes.0.homeroom_teacher_id', $teacher->id)
            ->where('classes.0.students_count', 3)
            ->where('filters.search', ''));
});

test('data kelas page can search by class name', function () {
    $admin = User::factory()->asAdmin()->create();
    SchoolClass::factory()->create(['name' => 'VII A', 'grade_level' => 'VII']);
    SchoolClass::factory()->create(['name' => 'VIII B', 'grade_level' => 'VIII']);

    $this->actingAs($admin)->get(route('admin.data-kelas', ['search' => 'VII A']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('classes', 1)
            ->where('classes.0.name', 'VII A')
            ->where('filters.search', 'VII A'));
});

test('data kelas page can search by grade level', function () {
    $admin = User::factory()->asAdmin()->create();
    SchoolClass::factory()->create(['name' => 'Kelas 10', 'grade_level' => 'X']);
    SchoolClass::factory()->create(['name' => 'Kelas 11', 'grade_level' => 'XI']);

    $this->actingAs($admin)->get(route('admin.data-kelas', ['search' => 'XI']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('classes', 1)
            ->where('classes.0.name', 'Kelas 11'));
});

test('data kelas page can search by homeroom teacher name', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacherUser = User::factory()->create(['name' => 'Ahmad Dahlan']);
    $teacher = Teacher::factory()->create(['user_id' => $teacherUser->id]);
    SchoolClass::factory()->create(['name' => 'XII IPA', 'homeroom_teacher_id' => $teacher->id]);
    SchoolClass::factory()->create(['name' => 'XII IPS', 'homeroom_teacher_id' => null]);

    $this->actingAs($admin)->get(route('admin.data-kelas', ['search' => 'Ahmad']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('classes', 1)
            ->where('classes.0.name', 'XII IPA')
            ->where('classes.0.homeroom_teacher', 'Ahmad Dahlan'));
});

test('guests are redirected to the login page when storing a class', function () {
    $this->post(route('admin.data-kelas.store'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from storing a class', function () {
    $user = User::factory()->asSiswa()->create();

    $this->actingAs($user)
        ->post(route('admin.data-kelas.store'), [
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ])
        ->assertForbidden();
});

test('admin users can create a class with homeroom teacher', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-kelas.store'), [
            'name' => 'XII MIPA 1',
            'grade_level' => 'XII',
            'homeroom_teacher_id' => $teacher->id,
        ])
        ->assertRedirect(route('admin.data-kelas'));

    $this->assertDatabaseHas('classes', [
        'name' => 'XII MIPA 1',
        'grade_level' => 'XII',
        'homeroom_teacher_id' => $teacher->id,
    ]);
});

test('admin users can create a class without homeroom teacher', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-kelas.store'), [
            'name' => 'XI IPS 2',
            'grade_level' => 'XI',
            'homeroom_teacher_id' => null,
        ])
        ->assertRedirect(route('admin.data-kelas'));

    $this->assertDatabaseHas('classes', [
        'name' => 'XI IPS 2',
        'grade_level' => 'XI',
        'homeroom_teacher_id' => null,
    ]);
});

test('creating a class with duplicate name fails validation', function () {
    $admin = User::factory()->asAdmin()->create();
    $class = SchoolClass::factory()->create(['name' => 'X IPA 1']);

    $this->actingAs($admin)
        ->post(route('admin.data-kelas.store'), [
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ])
        ->assertSessionHasErrors(['name']);
});

test('creating a class requires mandatory fields', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-kelas.store'), [])
        ->assertSessionHasErrors(['name', 'grade_level']);
});

test('guests are redirected to the login page when updating a class', function () {
    $class = SchoolClass::factory()->create();

    $this->put(route('admin.data-kelas.update', $class->id))
        ->assertRedirect(route('login'));
});

test('non-admin users are forbidden from updating a class', function () {
    $user = User::factory()->asSiswa()->create();
    $class = SchoolClass::factory()->create();

    $this->actingAs($user)
        ->put(route('admin.data-kelas.update', $class->id), [
            'name' => 'X IPA 2',
            'grade_level' => 'X',
        ])
        ->assertForbidden();
});

test('admin users can update a class with homeroom teacher', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create([
        'name' => 'X IPA 1',
        'grade_level' => 'X',
        'homeroom_teacher_id' => null,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-kelas.update', $class->id), [
            'name' => 'X MIPA 1',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ])
        ->assertRedirect(route('admin.data-kelas'));

    $this->assertDatabaseHas('classes', [
        'id' => $class->id,
        'name' => 'X MIPA 1',
        'grade_level' => 'X',
        'homeroom_teacher_id' => $teacher->id,
    ]);
});

test('admin users can update a class to remove homeroom teacher', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create([
        'name' => 'X IPA 1',
        'grade_level' => 'X',
        'homeroom_teacher_id' => $teacher->id,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-kelas.update', $class->id), [
            'name' => 'X IPA 1 Updated',
            'grade_level' => 'X',
            'homeroom_teacher_id' => null,
        ])
        ->assertRedirect(route('admin.data-kelas'));

    $this->assertDatabaseHas('classes', [
        'id' => $class->id,
        'name' => 'X IPA 1 Updated',
        'grade_level' => 'X',
        'homeroom_teacher_id' => null,
    ]);
});

test('updating a class with its own name passes validation', function () {
    $admin = User::factory()->asAdmin()->create();
    $class = SchoolClass::factory()->create([
        'name' => 'X IPA 1',
        'grade_level' => 'X',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-kelas.update', $class->id), [
            'name' => 'X IPA 1',
            'grade_level' => 'XI',
        ])
        ->assertRedirect(route('admin.data-kelas'));

    $this->assertDatabaseHas('classes', [
        'id' => $class->id,
        'name' => 'X IPA 1',
        'grade_level' => 'XI',
    ]);
});

test('updating a class with duplicate name from another class fails validation', function () {
    $admin = User::factory()->asAdmin()->create();
    SchoolClass::factory()->create(['name' => 'X IPA 1']);
    $class2 = SchoolClass::factory()->create(['name' => 'X IPA 2']);

    $this->actingAs($admin)
        ->put(route('admin.data-kelas.update', $class2->id), [
            'name' => 'X IPA 1',
            'grade_level' => 'X',
        ])
        ->assertSessionHasErrors(['name']);
});

test('updating a class requires mandatory fields', function () {
    $admin = User::factory()->asAdmin()->create();
    $class = SchoolClass::factory()->create();

    $this->actingAs($admin)
        ->put(route('admin.data-kelas.update', $class->id), [])
        ->assertSessionHasErrors(['name', 'grade_level']);
});

test('creating a class with a teacher already assigned to another class fails validation', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    SchoolClass::factory()->create(['name' => 'X IPA 1', 'homeroom_teacher_id' => $teacher->id]);

    $this->actingAs($admin)
        ->post(route('admin.data-kelas.store'), [
            'name' => 'X IPA 2',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ])
        ->assertSessionHasErrors(['homeroom_teacher_id']);
});

test('updating a class with a teacher already assigned to another class fails validation', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    SchoolClass::factory()->create(['name' => 'X IPA 1', 'homeroom_teacher_id' => $teacher->id]);
    $class2 = SchoolClass::factory()->create(['name' => 'X IPA 2', 'homeroom_teacher_id' => null]);

    $this->actingAs($admin)
        ->put(route('admin.data-kelas.update', $class2->id), [
            'name' => 'X IPA 2',
            'grade_level' => 'X',
            'homeroom_teacher_id' => $teacher->id,
        ])
        ->assertSessionHasErrors(['homeroom_teacher_id']);
});

test('data kelas page includes homeroom_class_id in teachers options', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create([
        'name' => 'X IPA 1',
        'homeroom_teacher_id' => $teacher->id,
    ]);

    $this->actingAs($admin)->get(route('admin.data-kelas'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('teachers.0.id', $teacher->id)
            ->where('teachers.0.homeroom_class_id', $class->id));
});

test('guests are redirected to the login page when deleting homeroom teacher', function () {
    $class = SchoolClass::factory()->create();

    $this->delete(route('admin.data-kelas.destroy-homeroom-teacher', $class->id))
        ->assertRedirect(route('login'));
});

test('non-admin users are forbidden from deleting homeroom teacher', function () {
    $user = User::factory()->asSiswa()->create();
    $class = SchoolClass::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.data-kelas.destroy-homeroom-teacher', $class->id))
        ->assertForbidden();
});

test('admin users can delete homeroom teacher from a class', function () {
    $admin = User::factory()->asAdmin()->create();
    $teacher = Teacher::factory()->create();
    $class = SchoolClass::factory()->create([
        'name' => 'X IPA 1',
        'homeroom_teacher_id' => $teacher->id,
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.data-kelas.destroy-homeroom-teacher', $class->id))
        ->assertRedirect(route('admin.data-kelas'));

    $this->assertDatabaseHas('classes', [
        'id' => $class->id,
        'homeroom_teacher_id' => null,
    ]);

    // Teacher record still exists
    $this->assertDatabaseHas('teachers', [
        'id' => $teacher->id,
    ]);
});
