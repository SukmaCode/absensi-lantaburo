<?php

namespace App\Services;

use App\Models\AttendanceStudent;
use App\Models\Student;
use App\Repositories\SiswaRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AbsenSiswaService
{
    public function __construct(private readonly SiswaRepository $repository) {}

    /**
     * @return array<string, mixed>
     */
    public function getAttendancePageData(Student $student): array
    {
        $student->loadMissing('schoolClass');
        $hasClass = ! empty($student->class_id) && $student->schoolClass !== null;
        $todayRecord = $this->repository->todayStudentAttendance($student->id);

        return [
            'hasClass' => $hasClass,
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
        $student->loadMissing('schoolClass');
        if (! $student->class_id || ! $student->schoolClass) {
            throw ValidationException::withMessages([
                'photo_selfie' => 'Anda belum mempunyai kelas. Silakan hubungi admin sekolah.',
            ]);
        }

        $photoPath = $this->handleSelfiePhoto($data['photo_selfie']);

        $now = Carbon::now();
        $currentTime = $now->format('H:i:s');
        if ($currentTime < '08:00:00' || $currentTime > '09:00:00') {
            throw ValidationException::withMessages([
                'attendance_time' => 'Presensi murid hanya dapat dilakukan pada jam 08:00 - 09:00 pagi.',
            ]);
        }

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
