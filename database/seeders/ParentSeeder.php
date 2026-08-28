<?php

namespace Database\Seeders;

use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;

class ParentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $parentUsers = User::where('role', 'orang_tua')->get();

        if ($parentUsers->isEmpty()) {
            $parentUsers = User::factory()->asOrangTua()->count(5)->create();
        }

        $parentProfiles = $parentUsers->map(function (User $user) {
            return ParentProfile::firstOrCreate([
                'user_id' => $user->id,
            ]);
        });

        // Hubungkan data murid ke profil orang tua
        $students = Student::all();
        $parentCount = $parentProfiles->count();

        if ($parentCount > 0 && $students->isNotEmpty()) {
            $students->each(function (Student $student, int $index) use ($parentProfiles, $parentCount) {
                /** @var ParentProfile $parent */
                $parent = $parentProfiles[$index % $parentCount];
                $parentUser = $parent->user;

                $student->update([
                    'parent_id' => $parent->id,
                    'parent_name' => $parentUser?->name ?? $student->parent_name,
                    'parent_phone' => $parentUser?->phone ?? $student->parent_phone,
                ]);
            });
        }
    }
}
