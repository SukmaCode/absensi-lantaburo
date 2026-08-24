<?php

use App\Models\Payment;
use App\Models\Student;
use App\Models\User;
use App\Services\MidtransService;

beforeEach(function () {
    config()->set('midtrans.server_key', 'dummy-server-key');
    config()->set('midtrans.client_key', 'dummy-client-key');
    config()->set('midtrans.is_production', false);
    config()->set('midtrans.registration_fee', 150000);
});

test('calon siswa can access their dashboard', function () {
    $user = User::factory()->create([
        'role' => 'calon_siswa',
        'status' => 'inactive',
    ]);
    Student::create([
        'user_id' => $user->id,
        'nis' => 'CS-001',
        'gender' => 'L',
    ]);
    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => 'REG-U'.$user->id.'-111',
        'amount' => 150000,
        'type' => 'registration',
        'status' => 'pending',
        'snap_token' => 'dummy-snap-token-cs',
    ]);

    $response = $this->actingAs($user)->get(route('calon-siswa.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('calon-siswa/dashboard')
        ->has('user')
        ->where('user.name', $user->name)
        ->where('user.role', 'calon_siswa')
        ->where('user.status', 'inactive')
        ->has('studentInfo')
        ->where('studentInfo.nis', 'CS-001')
        ->has('registrationPayment')
        ->where('registrationPayment.orderId', 'REG-U'.$user->id.'-111')
        ->where('registrationPayment.status', 'pending')
        ->where('registrationPayment.isPending', true)
        ->where('registrationPayment.snapToken', 'dummy-snap-token-cs')
    );
});

test('student accessing calon siswa dashboard is redirected to siswa dashboard', function () {
    $user = User::factory()->create([
        'role' => 'siswa',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->get(route('calon-siswa.dashboard'));

    $response->assertRedirect(route('siswa.dashboard'));
});

test('calon siswa accessing student dashboard is redirected to calon siswa dashboard', function () {
    $user = User::factory()->create([
        'role' => 'calon_siswa',
        'status' => 'inactive',
    ]);

    $response = $this->actingAs($user)->get(route('siswa.dashboard'));

    $response->assertRedirect(route('calon-siswa.dashboard'));
});

test('calon siswa can get or refresh snap token', function () {
    $user = User::factory()->create([
        'role' => 'calon_siswa',
        'status' => 'inactive',
    ]);
    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => 'REG-U'.$user->id.'-222',
        'amount' => 150000,
        'type' => 'registration',
        'status' => 'pending',
        'snap_token' => 'snap-token-existing',
    ]);

    $response = $this->actingAs($user)->postJson(route('calon-siswa.payment.snap-token'));

    $response->assertOk()
        ->assertJson([
            'order_id' => 'REG-U'.$user->id.'-222',
            'amount' => 150000,
            'snap_token' => 'snap-token-existing',
            'status' => 'pending',
        ]);
});

test('checking status when paid upgrades user role to siswa and status to active', function () {
    $user = User::factory()->create([
        'role' => 'calon_siswa',
        'status' => 'inactive',
    ]);
    $orderId = 'REG-U'.$user->id.'-333';
    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => $orderId,
        'amount' => 150000,
        'type' => 'registration',
        'status' => 'pending',
        'snap_token' => 'token-test',
    ]);

    $this->mock(MidtransService::class, function ($mock) use ($orderId, $payment) {
        $mock->shouldReceive('checkTransactionStatus')
            ->once()
            ->with($orderId)
            ->andReturnUsing(function () use ($payment) {
                $payment->update([
                    'status' => 'settlement',
                    'settlement_time' => now(),
                    'payment_type' => 'qris',
                ]);

                return [
                    'success' => true,
                    'status' => 'settlement',
                    'payment' => $payment,
                    'message' => 'Status pembayaran berhasil diperbarui.',
                ];
            });
    });

    $response = $this->actingAs($user)->postJson(route('calon-siswa.payment.check-status'), [
        'order_id' => $orderId,
    ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'is_paid' => true,
            'redirect_url' => route('siswa.dashboard'),
        ]);

    $user->refresh();
    expect($user->role)->toBe('siswa');
    expect($user->status)->toBe('active');
});

test('calon siswa logging in is redirected to calon-siswa dashboard', function () {
    $user = User::factory()->create([
        'email' => 'calon@example.com',
        'password' => 'Password123!',
        'role' => 'calon_siswa',
        'status' => 'inactive',
    ]);

    $response = $this->post(route('login.store'), [
        'email' => 'calon@example.com',
        'password' => 'Password123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('calon-siswa.dashboard'));
});
