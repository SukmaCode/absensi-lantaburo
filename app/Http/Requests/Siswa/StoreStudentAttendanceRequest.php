<?php

namespace App\Http\Requests\Siswa;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()?->role, ['siswa', 'student'], true);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo_selfie' => ['required'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo_selfie.required' => 'Foto selfie wajib diambil sebagai bukti kehadiran.',
        ];
    }
}
