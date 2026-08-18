<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->firstOrFail();

        $announcements = [
            [
                'title' => 'Pengumuman Jadwal Ujian Akhir Semester',
                'content' => 'Ujian Akhir Semester akan dilaksanakan pada minggu ke-4 bulan ini. Seluruh siswa diwajibkan memakai seragam lengkap dan membawa kartu peserta.',
                'target_role' => 'siswa',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Rapat Pleno Dewan Guru',
                'content' => 'Rapat pleno dewan guru akan diselenggarakan di ruang guru pada hari Jumat pukul 13.00 WIB. Kehadiran seluruh guru wajib.',
                'target_role' => 'guru',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Kegiatan Bakti Sosial dan Jalan Sehat',
                'content' => 'Sekolah akan mengadakan bakti sosial dan jalan sehat dalam rangka memperingati hari jadi sekolah. Kegiatan diikuti oleh seluruh warga sekolah.',
                'target_role' => 'all',
                'published_at' => now(),
            ],
            [
                'title' => 'Pembayaran SPP Bulan Depan',
                'content' => 'Pembayaran SPP bulan depan sudah dapat dilakukan mulai tanggal 1 melalui bank yang bekerja sama dengan sekolah.',
                'target_role' => 'siswa',
                'published_at' => now()->addDays(2),
            ],
            [
                'title' => 'Pendaftaran Ekstrakurikuler Baru',
                'content' => 'Pendaftaran ekstrakurikuler robotik dan pramuka dibuka hingga akhir bulan. Silakan mendaftar ke pembina masing-masing.',
                'target_role' => 'all',
                'published_at' => now()->addDays(5),
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::factory()->create([
                'created_by' => $admin->id,
                'title' => $announcement['title'],
                'content' => $announcement['content'],
                'target_role' => $announcement['target_role'],
                'published_at' => $announcement['published_at'],
            ]);
        }
    }
}
