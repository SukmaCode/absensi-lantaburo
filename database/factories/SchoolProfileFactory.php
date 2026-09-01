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
            'hero_image' => null,
            'about_image' => null,
            'activities_image_1' => null,
            'activities_image_2' => null,
            'activities_image_3' => null,
            'description_heading' => 'Pendidikan yang personal, mendukung, dan bermakna bagi anak.',
            'description_body' => 'Lantaburo membantu setiap anak tumbuh sesuai potensinya lewat pendekatan belajar yang hangat, inklusif, dan menantang. Kami berjalan bersama orang tua dalam setiap langkah tumbuh kembang putra-putri Anda.',
            'address' => 'Jl. Nuradji No.14, RT.002/RW.002, Tangerang Kota',
            'phone' => '08123456789',
            'email' => 'lantaburo@sch.id',
        ];
    }
}
