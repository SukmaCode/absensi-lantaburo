<?php

namespace Database\Factories;

use App\Models\AttendanceTeacher;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceTeacher>
 */
class AttendanceTeacherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'teacher_id' => Teacher::factory(),
            'date' => now()->toDateString(),
            'check_in_time' => '07:00:00',
            'status' => fake()->randomElement(['hadir', 'terlambat', 'izin', 'sakit', 'alpha']),
            'notes' => null,
        ];
    }
}
