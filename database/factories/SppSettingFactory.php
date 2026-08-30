<?php

namespace Database\Factories;

use App\Models\SppSetting;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SppSetting>
 */
class SppSettingFactory extends Factory
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
            'amount' => 150000,
            'notes' => 'SPP Bulanan',
        ];
    }
}
