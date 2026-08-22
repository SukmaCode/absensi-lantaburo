<?php

namespace App\Http\Requests\Guru;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBatchStudentAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        $teacher = $this->user()?->teacher;

        return $teacher !== null && $teacher->homeroomClass !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $teacher = $this->user()?->teacher;
        $classId = $teacher?->homeroomClass?->id;

        return [
            'date' => ['required', 'date'],
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.student_id' => [
                'required',
                'integer',
                Rule::exists('students', 'id')->where(function ($query) use ($classId) {
                    return $query->where('class_id', $classId);
                }),
            ],
            'attendances.*.status' => ['required', 'in:hadir,terlambat,izin,sakit,alpha'],
            'attendances.*.notes' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'date.required' => 'Tanggal absensi wajib diisi.',
            'date.date' => 'Format tanggal absensi tidak valid.',
            'attendances.required' => 'Data absensi murid wajib disertakan.',
            'attendances.min' => 'Minimal ada satu data murid untuk diabsen.',
            'attendances.*.student_id.required' => 'ID Murid wajib disertakan.',
            'attendances.*.student_id.exists' => 'Murid harus terdaftar di kelas perwalian Anda.',
            'attendances.*.status.required' => 'Status kehadiran wajib dipilih.',
            'attendances.*.status.in' => 'Status kehadiran tidak valid.',
            'attendances.*.notes.max' => 'Catatan maksimal 255 karakter.',
        ];
    }
}
