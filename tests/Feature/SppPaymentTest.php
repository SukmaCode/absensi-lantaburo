<?php

use App\Models\ParentProfile;
use App\Models\PaymentSpp;
use App\Models\SppSetting;
use App\Models\Student;
use App\Models\User;
use App\Services\MidtransService;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page on spp payment', function () {
    $this->get(route('orangtua.spp-payment'))->assertRedirect(route('login'));
});

test('non-parent users are forbidden from spp payment page', function () {
    $siswa = User::factory()->create(['role' => 'siswa']);

    $this->actingAs($siswa)
        ->get(route('orangtua.spp-payment'))
        ->assertForbidden();
});

test('parent can access spp payment page without children', function () {
    $parentUser = User::factory()->asOrangTua()->create();

    $this->actingAs($parentUser)
        ->get(route('orangtua.spp-payment'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orangtua/spp-payment')
            ->where('hasChildren', false)
            ->where('children', [])
            ->where('selectedStudent', null));
});

test('parent can access spp payment page with child data and spp setting', function () {
    $parentUser = User::factory()->asOrangTua()->create();
    $parentProfile = ParentProfile::factory()->create(['user_id' => $parentUser->id]);
    $student = Student::factory()->create([
        'parent_id' => $parentProfile->id,
        'created_at' => now()->subMonths(2),
    ]);

    SppSetting::factory()->create([
        'student_id' => $student->id,
        'amount' => 200000,
    ]);

    $this->actingAs($parentUser)
        ->get(route('orangtua.spp-payment'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orangtua/spp-payment')
            ->where('hasChildren', true)
            ->where('hasSppSetting', true)
            ->where('sppAmount', 200000)
            ->has('children', 1)
            ->where('selectedStudent.id', $student->id)
            ->has('sppHistory', 3));
});

test('spp history only displays months starting from student registration month', function () {
    $parentUser = User::factory()->asOrangTua()->create();
    $parentProfile = ParentProfile::factory()->create(['user_id' => $parentUser->id]);

    // Student registered 1 month ago
    $student = Student::factory()->create([
        'parent_id' => $parentProfile->id,
        'created_at' => now()->subMonth(),
    ]);

    SppSetting::factory()->create([
        'student_id' => $student->id,
        'amount' => 150000,
    ]);

    $this->actingAs($parentUser)
        ->get(route('orangtua.spp-payment'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('orangtua/spp-payment')
            ->has('sppHistory', 2)
            ->where('sppHistory.0.month', now()->format('Y-m'))
            ->where('sppHistory.1.month', now()->subMonth()->format('Y-m')));
});

test('parent cannot generate snap token for child without spp setting', function () {
    $parentUser = User::factory()->asOrangTua()->create();
    $parentProfile = ParentProfile::factory()->create(['user_id' => $parentUser->id]);
    $student = Student::factory()->create(['parent_id' => $parentProfile->id]);

    $this->actingAs($parentUser)
        ->postJson(route('orangtua.spp-payment.snap-token'), [
            'student_id' => $student->id,
            'month' => now()->format('Y-m'),
        ])
        ->assertStatus(422)
        ->assertJson([
            'message' => 'Nominal SPP untuk siswa ini belum diatur. Hubungi admin sekolah.',
        ]);
});

test('parent cannot check status of payment from unrelated student', function () {
    $parentUser = User::factory()->asOrangTua()->create();
    ParentProfile::factory()->create(['user_id' => $parentUser->id]);

    $unrelatedStudent = Student::factory()->create();
    $payment = PaymentSpp::factory()->create([
        'student_id' => $unrelatedStudent->id,
        'order_id' => 'SPP-TEST-ORDER-123',
    ]);

    $this->actingAs($parentUser)
        ->postJson(route('orangtua.spp-payment.check-status'), [
            'order_id' => $payment->order_id,
        ])
        ->assertStatus(404);
});

test('parent can generate snap token for child with spp setting', function () {
    $parentUser = User::factory()->asOrangTua()->create();
    $parentProfile = ParentProfile::factory()->create(['user_id' => $parentUser->id]);
    $student = Student::factory()->create(['parent_id' => $parentProfile->id]);

    SppSetting::factory()->create([
        'student_id' => $student->id,
        'amount' => 250000,
    ]);

    $this->mock(MidtransService::class, function ($mock) {
        $mock->shouldReceive('createSppSnapToken')
            ->once()
            ->andReturn('dummy-spp-snap-token-xyz');
    });

    $this->actingAs($parentUser)
        ->postJson(route('orangtua.spp-payment.snap-token'), [
            'student_id' => $student->id,
            'month' => '2026-08',
        ])
        ->assertOk()
        ->assertJson([
            'amount' => 250000,
            'snap_token' => 'dummy-spp-snap-token-xyz',
            'status' => 'pending',
        ]);
});

test('parent cannot generate snap token for already paid spp month', function () {
    $parentUser = User::factory()->asOrangTua()->create();
    $parentProfile = ParentProfile::factory()->create(['user_id' => $parentUser->id]);
    $student = Student::factory()->create(['parent_id' => $parentProfile->id]);

    SppSetting::factory()->create([
        'student_id' => $student->id,
        'amount' => 250000,
    ]);

    PaymentSpp::factory()->create([
        'student_id' => $student->id,
        'month' => '2026-08',
        'status' => 'success',
        'settlement_time' => now(),
    ]);

    $this->actingAs($parentUser)
        ->postJson(route('orangtua.spp-payment.snap-token'), [
            'student_id' => $student->id,
            'month' => '2026-08',
        ])
        ->assertStatus(422)
        ->assertJson([
            'message' => 'SPP bulan ini sudah lunas.',
            'status' => 'success',
        ]);
});
