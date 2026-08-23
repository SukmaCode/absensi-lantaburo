<?php

namespace App\Http\Requests\Siswa;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentProfileRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User $user */
        $user = $this->user();
        $student = $user->student;
        $studentId = $student?->id;

        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => [
                'required',
                'string',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'photo' => ['nullable'],
            'remove_photo' => ['nullable', 'boolean'],
            'nis' => [
                'required',
                'string',
                'max:30',
                $studentId
                    ? Rule::unique('students', 'nis')->ignore($studentId)
                    : Rule::unique('students', 'nis'),
            ],
            'class_id' => ['nullable', 'exists:classes,id'],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:500'],
            'parent_name' => ['nullable', 'string', 'max:150'],
            'parent_phone' => ['nullable', 'string', 'max:20'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama lengkap maksimal 150 karakter.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Alamat email sudah digunakan oleh pengguna lain.',
            'phone.max' => 'Nomor telepon maksimal 20 karakter.',
            'nis.required' => 'NIS (Nomor Induk Siswa) wajib diisi.',
            'nis.max' => 'NIS maksimal 30 karakter.',
            'nis.unique' => 'NIS sudah digunakan oleh siswa lain.',
            'class_id.exists' => 'Kelas yang dipilih tidak valid.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.in' => 'Jenis kelamin harus Laki-laki (L) atau Perempuan (P).',
            'birth_date.date' => 'Format tanggal lahir tidak valid.',
            'address.max' => 'Alamat maksimal 500 karakter.',
            'parent_name.max' => 'Nama orang tua/wali maksimal 150 karakter.',
            'parent_phone.max' => 'Nomor telepon orang tua maksimal 20 karakter.',
        ];
    }
}
