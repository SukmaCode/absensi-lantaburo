<?php

namespace Database\Factories;

use App\Models\SchoolProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SchoolProfile>
 */
class SchoolProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'SMA Negeri 1 Lantaburo',
            'logo' => null,
            'description' => 'Sekolah menengah atas negeri yang unggul dalam prestasi akademik dan karakter.',
            'address' => fake()->streetAddress().', '.fake()->city().', '.fake()->stateAbbr(),
            'phone' => fake()->numerify('021#######'),
            'email' => 'info@sman1lantaburo.sch.id',
        ];
    }
}
