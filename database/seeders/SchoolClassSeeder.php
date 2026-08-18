<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class SchoolClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = [
            ['XII IPA 1', 'XII'],
            ['XII IPA 2', 'XII'],
            ['XII IPS 1', 'XII'],
            ['XII IPS 2', 'XII'],
        ];

        $teachers = Teacher::pluck('id');

        foreach ($classes as $index => [$name, $gradeLevel]) {
            SchoolClass::factory()->create([
                'name' => $name,
                'grade_level' => $gradeLevel,
                'homeroom_teacher_id' => $teachers[$index],
            ]);
        }
    }
}
