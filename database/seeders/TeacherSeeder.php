<?php

namespace Database\Seeders;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::where('role', 'guru')->get()->each(function (User $user) {
            Teacher::factory()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
