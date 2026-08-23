<?php

namespace App\Services;

use App\Models\AttendanceStudent;
use App\Models\Student;
use App\Repositories\SiswaRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AbsenSiswaService
{
    public function __construct(private readonly SiswaRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getAttendancePageData(Student $student): array
    {
        $todayRecord = $this->repository->todayStudentAttendance($student->id);

        return [
            'todayAttendance' => $todayRecord ? [
                'hasUploaded' => true,
                'checkInTime' => $this->formatTime($todayRecord->check_in_time),
                'date' => Carbon::parse($todayRecord->date)->translatedFormat('l, d F Y'),
                'photoUrl' => $todayRecord->photo_selfie ? asset('storage/'.$todayRecord->photo_selfie) : null,
                'status' => $todayRecord->status,
                'statusLabel' => $todayRecord->status ? $this->statusLabel($todayRecord->status) : null,
                'notes' => $todayRecord->notes,
            ] : [
                'hasUploaded' => false,
            ],
            'currentTime' => Carbon::now()->format('H:i'),
            'currentDate' => Carbon::now()->translatedFormat('l, d F Y'),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function storeAttendance(Student $student, array $data): AttendanceStudent
    {
        $photoPath = $this->handleSelfiePhoto($data['photo_selfie']);

        return $this->repository->saveStudentSelfie($student, [
            'photo_selfie' => $photoPath,
        ]);
    }

    private function handleSelfiePhoto(mixed $photo): string
    {
        if ($photo instanceof UploadedFile) {
            return $photo->store('selfies/students', 'public');
        }

        if (is_string($photo) && str_starts_with($photo, 'data:image')) {
            $parts = explode(',', $photo, 2);
            $imageContent = base64_decode($parts[1] ?? $parts[0]);
            $fileName = 'selfies/students/'.Str::random(40).'.jpg';

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
