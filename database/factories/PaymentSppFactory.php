<?php

namespace Database\Factories;

use App\Models\PaymentSpp;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentSpp>
 */
class PaymentSppFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => Student::factory(),
            'order_id' => 'SPP-S'.fake()->numberBetween(1, 999).'-'.now()->format('Y-m').'-'.fake()->randomNumber(5),
            'amount' => 150000,
            'month' => now()->format('Y-m'),
            'status' => 'pending',
            'payment_type' => 'bank_transfer',
            'snap_token' => fake()->uuid(),
            'payment_url' => null,
            'settlement_time' => null,
            'raw_response' => null,
        ];
    }
}
