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
                'title' => 'Peringatan Hari Kemerdekaan RI',
                'description' => 'Upacara bendera dan lomba-lomba tradisional antar kelas dalam rangka memperingati hari kemerdekaan.',
                'event_date' => now()->addDays(5)->toDateString(),
                'location' => 'Lapangan Sekolah',
            ],
            [
                'title' => 'Seminar Karier dan Bimbingan Perguruan Tinggi',
                'description' => 'Seminar karier untuk siswa kelas XII bersama narasumber dari universitas terkemuka.',
                'event_date' => now()->addDays(15)->toDateString(),
                'location' => 'Aula Sekolah',
            ],
            [
                'title' => 'Kunjungan Industri Jurusan Teknik',
                'description' => 'Kunjungan industri untuk program peminatan sebagai bagian dari pembelajaran berbasis dunia kerja.',
                'event_date' => now()->addDays(25)->toDateString(),
                'location' => 'Kawasan Industri Jakarta',
            ],
        ];

        foreach ($events as $event) {
            Event::factory()->create($event);
        }
    }
}
