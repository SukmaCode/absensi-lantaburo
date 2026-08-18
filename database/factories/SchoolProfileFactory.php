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
            'name' => 'Homeschooling Lantaburo',
            'logo' => null,
            'description' => 'Lembaga pendidikan alternatif yang menghadirkan pengalaman belajar personal, mendukung, dan bermakna bagi setiap anak.',
            'address' => 'Jl. Pendidikan No. 12, Kecamatan Lantaburo',
            'phone' => fake()->numerify('021#######'),
            'email' => 'halo@lantaburo.sch.id',
        ];
    }
}
