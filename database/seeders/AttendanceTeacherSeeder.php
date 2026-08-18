<?php

namespace Database\Seeders;

use App\Models\AttendanceTeacher;
use App\Models\Teacher;
use Illuminate\Database\Seeder;

class AttendanceTeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dates = collect(range(13, 0))
            ->map(fn (int $daysAgo) => now()->subDays($daysAgo)->toDateString())
            ->filter(fn (string $date) => ! now()->parse($date)->isWeekend())
            ->values();

        $statuses = ['hadir', 'hadir', 'hadir', 'hadir', 'terlambat', 'izin', 'sakit', 'alpha'];

        Teacher::all()->each(function (Teacher $teacher) use ($dates, $statuses) {
            foreach ($dates as $date) {
                $status = $statuses[array_rand($statuses)];

                AttendanceTeacher::factory()->create([
                    'teacher_id' => $teacher->id,
                    'date' => $date,
                    'status' => $status,
                    'check_in_time' => match ($status) {
                        'hadir' => '06:45:00',
                        'terlambat' => '07:20:00',
                        default => null,
                    },
                    'check_out_time' => in_array($status, ['hadir', 'terlambat']) ? '16:00:00' : null,
                    'notes' => match ($status) {
                        'izin' => 'Dinas luar',
                        'sakit' => 'Kurang sehat',
                        default => null,
                    },
                ]);
            }
        });
    }
}
