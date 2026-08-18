<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classIds = SchoolClass::pluck('id');
        $classCount = $classIds->count();

        User::where('role', 'siswa')->get()->each(function (User $user, int $index) use ($classIds, $classCount) {
            Student::factory()->create([
                'user_id' => $user->id,
                'class_id' => $classIds[$index % $classCount],
            ]);
        });
    }
}
