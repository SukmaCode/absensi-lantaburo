<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['XII IPA 1', 'XII IPA 2', 'XII IPS 1', 'XII IPS 2']),
            'grade_level' => fake()->randomElement(['X', 'XI', 'XII']),
            'homeroom_teacher_id' => Teacher::factory(),
        ];
    }
}
