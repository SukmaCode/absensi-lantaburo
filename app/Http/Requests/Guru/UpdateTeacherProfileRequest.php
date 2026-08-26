<?php

namespace App\Http\Requests\Guru;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherProfileRequest extends FormRequest
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
        $teacher = $user->teacher;
        $teacherId = $teacher?->id;

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
            'nip' => [
                'nullable',
                'string',
                'max:30',
                $teacherId
                    ? Rule::unique('teachers', 'nip')->ignore($teacherId)
                    : Rule::unique('teachers', 'nip'),
            ],
            'subject' => ['nullable', 'string', 'max:100'],
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
            'nip.max' => 'NIP maksimal 30 karakter.',
            'nip.unique' => 'NIP sudah digunakan oleh guru lain.',
            'subject.max' => 'Mata pelajaran maksimal 100 karakter.',
        ];
    }
}
