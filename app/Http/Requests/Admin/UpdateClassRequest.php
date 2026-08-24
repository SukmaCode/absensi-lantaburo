<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClassRequest extends FormRequest
{
    public function rules(): array
    {
        $classId = (int) $this->route('id');

        return [
            'name' => ['required', 'string', 'max:50', Rule::unique('classes', 'name')->ignore($classId)],
            'grade_level' => ['required', 'string', 'max:20'],
            'homeroom_teacher_id' => [
                'nullable',
                'integer',
                'exists:teachers,id',
                Rule::unique('classes', 'homeroom_teacher_id')->ignore($classId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama kelas harus diisi.',
            'name.max' => 'Nama kelas maksimal 50 karakter.',
            'name.unique' => 'Nama kelas sudah terdaftar.',
            'grade_level.required' => 'Tingkat / Jenjang harus diisi.',
            'grade_level.max' => 'Tingkat / Jenjang maksimal 20 karakter.',
            'homeroom_teacher_id.exists' => 'Wali kelas tidak valid.',
            'homeroom_teacher_id.unique' => 'Guru ini sudah menjadi wali kelas di kelas lain.',
        ];
    }
}
