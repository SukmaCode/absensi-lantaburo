<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->asAdmin()->create([
            'name' => 'Admin Sekolah',
            'email' => 'admin@example.com',
        ]);

        User::factory()->asGuru()->count(5)->create();
        User::factory()->asSiswa()->count(20)->create();
    }
}
