<?php

namespace Database\Factories;

use App\Models\AttendanceStudent;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceStudent>
 */
class AttendanceStudentFactory extends Factory
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
            'date' => now()->toDateString(),
            'check_in_time' => '07:00:00',
            'status' => fake()->randomElement(['hadir', 'terlambat', 'izin', 'sakit', 'alpha']),
            'notes' => null,
        ];
    }
}
