<?php

namespace Database\Seeders;

use App\Models\AttendanceStudent;
use App\Models\Student;
use Illuminate\Database\Seeder;

class AttendanceStudentSeeder extends Seeder
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

        Student::all()->each(function (Student $student) use ($dates, $statuses) {
            foreach ($dates as $date) {
                $status = $statuses[array_rand($statuses)];

                AttendanceStudent::factory()->create([
                    'student_id' => $student->id,
                    'date' => $date,
                    'status' => $status,
                    'check_in_time' => match ($status) {
                        'hadir' => '07:00:00',
                        'terlambat' => '07:25:00',
                        default => null,
                    },
                    'check_out_time' => in_array($status, ['hadir', 'terlambat']) ? '16:00:00' : null,
                    'notes' => match ($status) {
                        'izin' => 'Keperluan keluarga',
                        'sakit' => 'Tidak enak badan',
                        default => null,
                    },
                ]);
            }
        });
    }
}
