<?php

use App\Models\ParentProfile;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page on data orang tua', function () {
    $this->get(route('admin.data-orangtua'))->assertRedirect(route('login'));
});

test('non-admin users are forbidden from the data orang tua page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.data-orangtua'))
        ->assertForbidden();
});

test('admin users can visit the data orang tua page', function () {
    $admin = User::factory()->asAdmin()->create();

    $this->actingAs($admin)->get(route('admin.data-orangtua'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/data-orangtua')
            ->has('parents')
            ->has('pagination')
            ->has('availableStudents'));
});

test('data orang tua page maps parent preview fields with student relations', function () {
    $admin = User::factory()->asAdmin()->create();
    $parentUser = User::factory()->asOrangTua()->create([
        'name' => 'Ayah Rudi',
        'email' => 'rudi.ayah@example.com',
        'phone' => '081234567890',
        'status' => 'active',
    ]);
    $parent = ParentProfile::factory()->create([
        'user_id' => $parentUser->id,
    ]);

    $class = SchoolClass::factory()->create(['name' => '10 MIPA 1']);
    $studentUser = User::factory()->asSiswa()->create(['name' => 'Anak Rudi']);
    $student = Student::factory()->create([
        'user_id' => $studentUser->id,
        'parent_id' => $parent->id,
        'class_id' => $class->id,
        'nis' => '123456',
    ]);

    $this->actingAs($admin)->get(route('admin.data-orangtua'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('parents.0.id', $parent->id)
            ->where('parents.0.name', 'Ayah Rudi')
            ->where('parents.0.email', 'rudi.ayah@example.com')
            ->where('parents.0.phone', '081234567890')
            ->where('parents.0.status', 'Aktif')
            ->where('parents.0.students.0.id', $student->id)
            ->where('parents.0.students.0.name', 'Anak Rudi')
            ->where('parents.0.students.0.nis', '123456')
            ->where('parents.0.students.0.class', '10 MIPA 1'));
});

test('data orang tua page can search by parent name and student name', function () {
    $admin = User::factory()->asAdmin()->create();

    $parentUserA = User::factory()->asOrangTua()->create(['name' => 'Bambang Sudir']);
    $parentA = ParentProfile::factory()->create(['user_id' => $parentUserA->id]);

    $parentUserB = User::factory()->asOrangTua()->create(['name' => 'Siti Aminah']);
    $parentB = ParentProfile::factory()->create(['user_id' => $parentUserB->id]);

    $studentUserB = User::factory()->asSiswa()->create(['name' => 'Doni Aminah']);
    Student::factory()->create([
        'user_id' => $studentUserB->id,
        'parent_id' => $parentB->id,
    ]);

    // Search by parent name
    $this->actingAs($admin)->get(route('admin.data-orangtua', ['search' => 'Bambang']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('parents', 1)
            ->where('parents.0.name', 'Bambang Sudir'));

    // Search by child/student name
    $this->actingAs($admin)->get(route('admin.data-orangtua', ['search' => 'Doni']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('parents', 1)
            ->where('parents.0.name', 'Siti Aminah'));
});

test('admin can create a new parent with assigned students', function () {
    $admin = User::factory()->asAdmin()->create();
    $studentUser = User::factory()->asSiswa()->create(['name' => 'Ahmad Fauzan']);
    $student = Student::factory()->create([
        'user_id' => $studentUser->id,
        'parent_id' => null,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.data-orangtua.store'), [
            'name' => 'Fauzan Senior',
            'email' => 'fauzan.senior@example.com',
            'password' => 'secret12345',
            'phone' => '08987654321',
            'status' => 'active',
            'student_ids' => [$student->id],
        ])
        ->assertRedirect(route('admin.data-orangtua'))
        ->assertSessionHas('success', 'Data orang tua berhasil ditambahkan.');

    $user = User::where('email', 'fauzan.senior@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('Fauzan Senior')
        ->and($user->role)->toBe('orang_tua')
        ->and($user->status)->toBe('active');

    $parentProfile = ParentProfile::where('user_id', $user->id)->first();
    expect($parentProfile)->not->toBeNull();

    $student->refresh();
    expect($student->parent_id)->toBe($parentProfile->id)
        ->and($student->parent_name)->toBe('Fauzan Senior')
        ->and($student->parent_phone)->toBe('08987654321');
});

test('admin create parent flashes the generated credentials', function () {
    $admin = User::factory()->asAdmin()->create();
    $studentUser = User::factory()->asSiswa()->create();
    $student = Student::factory()->create([
        'user_id' => $studentUser->id,
        'parent_id' => null,
    ]);

    $this->actingAs($admin)
        ->post(route('admin.data-orangtua.store'), [
            'name' => 'Credential Parent',
            'email' => 'credential.parent@example.com',
            'password' => 'secret12345',
            'phone' => '08987654321',
            'status' => 'active',
            'student_ids' => [$student->id],
        ])
        ->assertRedirect(route('admin.data-orangtua'))
        ->assertSessionHas('parent_credentials')
        ->assertSessionHas('parent_credentials.email', 'credential.parent@example.com')
        ->assertSessionHas('parent_credentials.password', 'secret12345');
});

test('admin can update a parent and sync assigned students', function () {
    $admin = User::factory()->asAdmin()->create();
    $parentUser = User::factory()->asOrangTua()->create([
        'name' => 'Old Parent Name',
        'email' => 'old.parent@example.com',
    ]);
    $parent = ParentProfile::factory()->create(['user_id' => $parentUser->id]);

    $student1 = Student::factory()->create(['parent_id' => $parent->id]);
    $student2 = Student::factory()->create(['parent_id' => null]);

    $this->actingAs($admin)
        ->put(route('admin.data-orangtua.update', $parent->id), [
            'name' => 'New Parent Name',
            'email' => 'new.parent@example.com',
            'phone' => '081122334455',
            'status' => 'inactive',
            'student_ids' => [$student2->id], // Switch from student1 to student2
        ])
        ->assertRedirect(route('admin.data-orangtua'))
        ->assertSessionHas('success', 'Data orang tua berhasil diperbarui.');

    $parentUser->refresh();
    expect($parentUser->name)->toBe('New Parent Name')
        ->and($parentUser->email)->toBe('new.parent@example.com')
        ->and($parentUser->phone)->toBe('081122334455')
        ->and($parentUser->status)->toBe('inactive');

    $student1->refresh();
    $student2->refresh();
    expect($student1->parent_id)->toBeNull()
        ->and($student2->parent_id)->toBe($parent->id)
        ->and($student2->parent_name)->toBe('New Parent Name');
});

test('admin can update a parent with a new password', function () {
    $admin = User::factory()->asAdmin()->create();
    $parentUser = User::factory()->asOrangTua()->create(['password' => 'old-password']);
    $parent = ParentProfile::factory()->create(['user_id' => $parentUser->id]);

    $this->actingAs($admin)
        ->put(route('admin.data-orangtua.update', $parent->id), [
            'name' => $parentUser->name,
            'email' => $parentUser->email,
            'status' => 'active',
            'password' => 'new-strong-password-123',
        ])
        ->assertRedirect(route('admin.data-orangtua'));

    $parentUser->refresh();
    expect(Hash::check('new-strong-password-123', $parentUser->password))->toBeTrue();
});

test('admin cannot update a parent with duplicate email', function () {
    $admin = User::factory()->asAdmin()->create();
    User::factory()->create(['email' => 'existing@example.com']);
    $parentUser = User::factory()->asOrangTua()->create(['email' => 'myemail@example.com']);
    $parent = ParentProfile::factory()->create(['user_id' => $parentUser->id]);

    $this->actingAs($admin)
        ->put(route('admin.data-orangtua.update', $parent->id), [
            'name' => 'Test Name',
            'email' => 'existing@example.com',
            'status' => 'active',
        ])
        ->assertSessionHasErrors(['email']);
});

test('admin can delete a parent and unlinks students', function () {
    $admin = User::factory()->asAdmin()->create();
    $parentUser = User::factory()->asOrangTua()->create();
    $parent = ParentProfile::factory()->create(['user_id' => $parentUser->id]);
    $student = Student::factory()->create(['parent_id' => $parent->id]);

    $this->actingAs($admin)
        ->delete(route('admin.data-orangtua.destroy', $parent->id))
        ->assertRedirect(route('admin.data-orangtua'))
        ->assertSessionHas('success', 'Data orang tua berhasil dihapus.');

    $this->assertDatabaseMissing('parents', ['id' => $parent->id]);
    $this->assertDatabaseMissing('users', ['id' => $parentUser->id]);

    $student->refresh();
    expect($student->parent_id)->toBeNull();
});

test('non-admin cannot update or delete a parent', function () {
    $user = User::factory()->create();
    $parent = ParentProfile::factory()->create();

    $this->actingAs($user)
        ->put(route('admin.data-orangtua.update', $parent->id), [
            'name' => 'Hacker Name',
            'email' => 'hacker@example.com',
            'status' => 'active',
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->delete(route('admin.data-orangtua.destroy', $parent->id))
        ->assertForbidden();
});
