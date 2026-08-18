<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Open House Homeschooling Lantaburo',
                'description' => 'Kunjungi kami dan kenali cara belajar di Lantaburo. Tur fasilitas, sesi diskusi dengan pendamping belajar, dan konsultasi langsung untuk orang tua.',
                'event_date' => now()->addDays(7)->toDateString(),
                'location' => 'Kampus Lantaburo',
            ],
            [
                'title' => 'Rapat Orang Tua & Wali Semester Ganjil',
                'description' => 'Diskusi perkembangan belajar siswa, rencana pembelajaran, dan kolaborasi antara pendamping belajar serta orang tua.',
                'event_date' => now()->addDays(14)->toDateString(),
                'location' => 'Aula Lantaburo',
            ],
            [
                'title' => 'Workshop Belajar di Alam Terbuka',
                'description' => 'Kegiatan belajar praktis di luar ruangan untuk mengasah kreativitas, kerja sama, dan keterampilan hidup siswa.',
                'event_date' => now()->addDays(21)->toDateString(),
                'location' => 'Taman Edukasi Lantaburo',
            ],
        ];

        foreach ($events as $event) {
            Event::factory()->create($event);
        }
    }
}
