<?php

use App\Models\Student;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page on data siswa', function () {
    $this->get(route('admin.data-siswa'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the data siswa page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.data-siswa'))
        ->assertForbidden();
});

test('admin users can visit the data siswa page', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->get(route('admin.data-siswa'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/data-siswa')
            ->has('students')
            ->has('pagination')
            ->has('classes'));
});

test('data siswa page paginates students', function () {
    $admin = User::factory()->asAdmin()->create();
    Student::factory()->count(15)->create();

    $this->actingAs($admin)->get(route('admin.data-siswa'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('students', 5)
            ->where('pagination.current_page', 1)
            ->where('pagination.last_page', 3)
            ->where('pagination.total', 15)
            ->where('pagination.links.0.url', null)
            ->where('pagination.links.1.active', true)
            ->whereNot('pagination.links.4.url', null));

    $this->actingAs($admin)->get(route('admin.data-siswa', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('students', 5)
            ->where('pagination.current_page', 2)
            ->where('pagination.last_page', 3)
            ->where('pagination.links.2.active', true)
            ->whereNot('pagination.links.0.url', null));
});

test('guests are redirected to the login page when storing a student', function () {
    $this->post(route('admin.data-siswa.store'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from storing a student', function () {
    $user = User::factory()->asSiswa()->create();

    $this->actingAs($user)
        ->post(route('admin.data-siswa.store'), [
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => 'password123',
            'nis' => '1234567890',
            'gender' => 'L',
        ])
        ->assertForbidden();
});

test('admin users can create a student', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-siswa.store'), [
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => 'password123',
            'phone' => '081234567890',
            'nis' => '1234567890',
            'gender' => 'L',
            'birth_date' => '2010-05-15',
            'address' => 'Jl. Merdeka No. 1',
            'parent_name' => 'Siti Aminah',
            'parent_phone' => '081298765432',
            'status' => 'active',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('users', [
        'email' => 'budi@example.com',
        'role' => 'siswa',
        'status' => 'active',
    ]);

    $this->assertDatabaseHas('students', [
        'nis' => '1234567890',
        'gender' => 'L',
        'parent_name' => 'Siti Aminah',
    ]);
});

test('creating a student with duplicate email or nis fails validation', function () {
    $admin = User::factory()->asAdmin()->create();
    $student = Student::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-siswa.store'), [
            'name' => 'Dup User',
            'email' => $student->user->email,
            'password' => 'password123',
            'nis' => $student->nis,
            'gender' => 'P',
        ])
        ->assertSessionHasErrors(['email', 'nis']);
});

test('creating a student requires mandatory fields', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-siswa.store'), [])
        ->assertSessionHasErrors(['name', 'email', 'password', 'nis', 'gender']);
});

test('guests are redirected to the login page when updating a student', function () {
    $student = Student::factory()->create();

    $this->put(route('admin.data-siswa.update', $student->id))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from updating a student', function () {
    $user = User::factory()->asSiswa()->create();
    $student = Student::factory()->create();

    $this->actingAs($user)
        ->put(route('admin.data-siswa.update', $student->id), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'nis' => '999999',
            'gender' => 'L',
            'status' => 'active',
        ])
        ->assertForbidden();
});

test('admin users can update a student with all fields', function () {
    $admin = User::factory()->asAdmin()->create();
    $student = Student::factory()->create([
        'nis' => '111111',
        'gender' => 'L',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-siswa.update', $student->id), [
            'name' => 'Nama Siswa Baru',
            'email' => 'siswabaru@example.com',
            'phone' => '08987654321',
            'nis' => '222222',
            'gender' => 'P',
            'birth_date' => '2011-08-20',
            'address' => 'Jl. Baru No. 12',
            'parent_name' => 'Ayah Baru',
            'parent_phone' => '08111222333',
            'status' => 'inactive',
        ])
        ->assertRedirect(route('admin.data-siswa'));

    $this->assertDatabaseHas('users', [
        'id' => $student->user_id,
        'name' => 'Nama Siswa Baru',
        'email' => 'siswabaru@example.com',
        'phone' => '08987654321',
        'status' => 'inactive',
    ]);

    $this->assertDatabaseHas('students', [
        'id' => $student->id,
        'nis' => '222222',
        'gender' => 'P',
        'birth_date' => '2011-08-20',
        'address' => 'Jl. Baru No. 12',
        'parent_name' => 'Ayah Baru',
        'parent_phone' => '08111222333',
    ]);
});

test('updating a student keeping own email and nis succeeds', function () {
    $admin = User::factory()->asAdmin()->create();
    $student = Student::factory()->create();

    $this->actingAs($admin)
        ->put(route('admin.data-siswa.update', $student->id), [
            'name' => $student->user->name,
            'email' => $student->user->email,
            'nis' => $student->nis,
            'gender' => $student->gender,
            'status' => 'active',
        ])
        ->assertRedirect(route('admin.data-siswa'));
});

test('updating a student with duplicate email or nis of another student fails validation', function () {
    $admin = User::factory()->asAdmin()->create();
    $student1 = Student::factory()->create();
    $student2 = Student::factory()->create();

    $this->actingAs($admin)
        ->put(route('admin.data-siswa.update', $student1->id), [
            'name' => 'Test Name',
            'email' => $student2->user->email,
            'nis' => $student2->nis,
            'gender' => 'L',
            'status' => 'active',
        ])
        ->assertSessionHasErrors(['email', 'nis']);
});

test('admin can set spp amount when creating and updating a student', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)
        ->post(route('admin.data-siswa.store'), [
            'name' => 'Siswa SPP Baru',
            'email' => 'siswaspp@example.com',
            'password' => 'password123',
            'nis' => 'SPP-001',
            'gender' => 'L',
            'status' => 'active',
            'spp_amount' => 200000,
        ])
        ->assertRedirect(route('admin.data-siswa'));

    $student = Student::where('nis', 'SPP-001')->firstOrFail();

    $this->assertDatabaseHas('spp_settings', [
        'student_id' => $student->id,
        'amount' => 200000,
    ]);

    $this->actingAs($admin)
        ->put(route('admin.data-siswa.update', $student->id), [
            'name' => 'Siswa SPP Baru',
            'email' => 'siswaspp@example.com',
            'nis' => 'SPP-001',
            'gender' => 'L',
            'status' => 'active',
            'spp_amount' => 250000,
        ])
        ->assertRedirect(route('admin.data-siswa'));

    $this->assertDatabaseHas('spp_settings', [
        'student_id' => $student->id,
        'amount' => 250000,
    ]);
});
