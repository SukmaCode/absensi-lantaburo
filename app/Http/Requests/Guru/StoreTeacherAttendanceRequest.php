<?php

namespace App\Http\Requests\Guru;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'guru' || $this->user()?->role === 'teacher';
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo_selfie' => ['required'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo_selfie.required' => 'Foto selfie wajib diambil sebagai bukti kehadiran.',
            'latitude.numeric' => 'Koordinat latitude tidak valid.',
            'longitude.numeric' => 'Koordinat longitude tidak valid.',
            'notes.max' => 'Catatan maksimal 255 karakter.',
        ];
    }
}
