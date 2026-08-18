<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'description' => fake()->paragraphs(2, true),
            'event_date' => fake()->dateTimeBetween('+1 week', '+1 month')->format('Y-m-d'),
            'location' => fake()->randomElement([
                'Aula Sekolah',
                'Lapangan Sekolah',
                'Lab Komputer',
                'Ruang Kelas XII IPA 1',
                'Perpustakaan',
            ]),
        ];
    }
}
