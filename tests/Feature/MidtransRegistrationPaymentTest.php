<?php

use App\Models\Payment;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Services\MidtransService;

beforeEach(function () {
    config()->set('midtrans.server_key', 'dummy-server-key');
    config()->set('midtrans.client_key', 'dummy-client-key');
    config()->set('midtrans.is_production', false);
    config()->set('midtrans.registration_fee', 150000);
});

test('user registration creates payment record and redirects to calon-siswa dashboard', function () {
    $this->mock(MidtransService::class, function ($mock) {
        $mock->shouldReceive('createSnapToken')
            ->once()
            ->andReturn('dummy-snap-token-123');
    });

    $response = $this->post(route('register.store'), [
        'name' => 'Ahmad Santoso',
        'email' => 'ahmad@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'phone' => '08123456789',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('calon-siswa.dashboard'));

    $user = User::where('email', 'ahmad@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->role)->toBe('calon_siswa');
    expect($user->status)->toBe('inactive');

    $payment = Payment::where('user_id', $user->id)->first();
    expect($payment)->not->toBeNull();
    expect($payment->status)->toBe('pending');
    expect($payment->amount)->toBe(150000);
    expect($payment->snap_token)->toBe('dummy-snap-token-123');
});

test('siswa dashboard renders registration payment data', function () {
    $teacherUser = User::factory()->create(['role' => 'guru']);
    $teacher = Teacher::create(['user_id' => $teacherUser->id, 'nip' => '123456789']);
    $schoolClass = SchoolClass::create(['name' => '10-A', 'grade_level' => '10', 'homeroom_teacher_id' => $teacher->id]);

    $user = User::factory()->create(['role' => 'siswa']);
    $student = Student::create(['user_id' => $user->id, 'nis' => 'S001', 'class_id' => $schoolClass->id, 'gender' => 'L']);

    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => 'REG-U'.$user->id.'-12345',
        'amount' => 150000,
        'type' => 'registration',
        'status' => 'pending',
        'snap_token' => 'dummy-token-abc',
    ]);

    $response = $this->actingAs($user)->get(route('siswa.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('siswa/dashboard')
        ->has('registrationPayment')
        ->where('registrationPayment.orderId', 'REG-U'.$user->id.'-12345')
        ->where('registrationPayment.status', 'pending')
        ->where('registrationPayment.isPending', true)
        ->where('registrationPayment.snapToken', 'dummy-token-abc')
    );
});

test('siswa can fetch or refresh snap token via api', function () {
    $user = User::factory()->create(['role' => 'siswa']);
    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => 'REG-U'.$user->id.'-999',
        'amount' => 150000,
        'type' => 'registration',
        'status' => 'pending',
        'snap_token' => 'existing-token',
    ]);

    $response = $this->actingAs($user)->postJson(route('siswa.payment.snap-token'));

    $response->assertOk()
        ->assertJson([
            'order_id' => 'REG-U'.$user->id.'-999',
            'amount' => 150000,
            'snap_token' => 'existing-token',
            'status' => 'pending',
        ]);
});

test('midtrans webhook successfully updates payment to success with valid signature', function () {
    $user = User::factory()->create(['role' => 'calon_siswa', 'status' => 'inactive']);
    $orderId = 'REG-U'.$user->id.'-test1';
    $amount = 150000;
    $statusCode = '200';
    $serverKey = config('midtrans.server_key');
    $validSignature = hash('sha512', $orderId.$statusCode.$amount.$serverKey);

    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => $orderId,
        'amount' => $amount,
        'type' => 'registration',
        'status' => 'pending',
        'snap_token' => 'dummy-snap-token',
    ]);

    $payload = [
        'order_id' => $orderId,
        'status_code' => $statusCode,
        'gross_amount' => (string) $amount,
        'signature_key' => $validSignature,
        'transaction_status' => 'settlement',
        'payment_type' => 'qris',
        'fraud_status' => 'accept',
    ];

    $response = $this->postJson(route('midtrans.callback'), $payload);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'order_id' => $orderId,
            'payment_status' => 'success',
        ]);

    $payment->refresh();
    expect($payment->status)->toBe('success');
    expect($payment->payment_type)->toBe('qris');
    expect($payment->settlement_time)->not->toBeNull();
    expect($payment->isPaid())->toBeTrue();

    $user->refresh();
    expect($user->role)->toBe('siswa');
    expect($user->status)->toBe('active');
});

test('midtrans webhook ignores payload with invalid signature', function () {
    $user = User::factory()->create(['role' => 'siswa']);
    $orderId = 'REG-U'.$user->id.'-invalid-test';
    $amount = 150000;

    $payment = Payment::create([
        'user_id' => $user->id,
        'order_id' => $orderId,
        'amount' => $amount,
        'type' => 'registration',
        'status' => 'pending',
    ]);

    $payload = [
        'order_id' => $orderId,
        'status_code' => '200',
        'gross_amount' => (string) $amount,
        'signature_key' => 'invalid-signature-key',
        'transaction_status' => 'settlement',
    ];

    $response = $this->postJson(route('midtrans.callback'), $payload);

    $response->assertOk()
        ->assertJson([
            'status' => 'ignored',
        ]);

    $payment->refresh();
    expect($payment->status)->toBe('pending');
});
