<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['L', 'P']);

        return [
            'user_id' => User::factory()->asSiswa(),
            'nis' => fake()->unique()->numerify('##########'),
            'class_id' => SchoolClass::factory(),
            'gender' => $gender,
            'birth_date' => fake()->dateTimeBetween('-18 years', '-15 years')->format('Y-m-d'),
            'address' => fake()->address(),
            'parent_name' => fake()->name($gender === 'L' ? 'female' : 'male'),
            'parent_phone' => fake()->numerify('08##########'),
        ];
    }
}
