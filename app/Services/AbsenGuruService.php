<?php

namespace App\Services;

use App\Models\AttendanceTeacher;
use App\Models\Teacher;
use App\Repositories\GuruRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AbsenGuruService
{
    public function __construct(private readonly GuruRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getAttendancePageData(Teacher $teacher): array
    {
        $todayAttendance = $this->repository->todayTeacherAttendance($teacher->id);

        return [
            'todayAttendance' => $todayAttendance ? [
                'hasAttended' => true,
                'checkInTime' => $this->formatTime($todayAttendance->check_in_time),
                'date' => Carbon::parse($todayAttendance->date)->translatedFormat('l, d F Y'),
                'status' => $this->statusLabel($todayAttendance->status),
                'rawStatus' => $todayAttendance->status,
                'photoUrl' => $todayAttendance->photo_selfie ? asset('storage/'.$todayAttendance->photo_selfie) : null,
                'latitude' => $todayAttendance->latitude,
                'longitude' => $todayAttendance->longitude,
                'notes' => $todayAttendance->notes,
            ] : [
                'hasAttended' => false,
            ],
            'currentTime' => Carbon::now()->format('H:i'),
            'currentDate' => Carbon::now()->translatedFormat('l, d F Y'),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function storeAttendance(Teacher $teacher, array $data): AttendanceTeacher
    {
        $photoPath = $this->handleSelfiePhoto($data['photo_selfie']);

        $now = Carbon::now();
        // Determine status based on time (e.g. after 07:30 is terlambat, or default 'hadir')
        $status = $data['status'] ?? ($now->format('H:i') > '07:30' ? 'terlambat' : 'hadir');

        return $this->repository->saveTeacherAttendance($teacher, [
            'photo_selfie' => $photoPath,
            'latitude' => isset($data['latitude']) ? (float) $data['latitude'] : null,
            'longitude' => isset($data['longitude']) ? (float) $data['longitude'] : null,
            'notes' => $data['notes'] ?? null,
            'status' => $status,
        ]);
    }

    private function handleSelfiePhoto(mixed $photo): string
    {
        if ($photo instanceof UploadedFile) {
            return $photo->store('selfies', 'public');
        }

        if (is_string($photo) && str_starts_with($photo, 'data:image')) {
            $parts = explode(',', $photo, 2);
            $imageContent = base64_decode($parts[1] ?? $parts[0]);
            $fileName = 'selfies/'.Str::random(40).'.jpg';

            Storage::disk('public')->put($fileName, $imageContent);

            return $fileName;
        }

        return (string) $photo;
    }

    private function statusLabel(string $status): string
    {
        return match ($status) {
            'hadir' => 'Hadir',
            'terlambat' => 'Terlambat',
            'izin' => 'Izin',
            'sakit' => 'Sakit',
            'alpha' => 'Tanpa Keterangan',
            default => ucfirst($status),
        };
    }

    private function formatTime(?string $time): string
    {
        return $time ? Carbon::createFromFormat('H:i:s', $time)->format('H:i') : '-';
    }
}
