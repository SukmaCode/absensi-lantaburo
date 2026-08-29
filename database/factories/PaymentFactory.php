<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'order_id' => 'REG-'.strtoupper(Str::random(12)),
            'amount' => fake()->randomElement([300000, 500000, 750000, 1000000]),
            'type' => 'registration',
            'status' => 'settlement',
            'payment_type' => fake()->randomElement(['bank_transfer', 'gopay', 'qris', null]),
            'snap_token' => null,
            'payment_url' => null,
            'settlement_time' => now()->subHours(fake()->numberBetween(1, 72)),
            'raw_response' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'settlement_time' => null,
        ]);
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'settlement',
            'settlement_time' => now()->subHours(fake()->numberBetween(1, 72)),
        ]);
    }
}
