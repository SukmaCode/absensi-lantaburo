<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClassRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50', 'unique:classes,name'],
            'grade_level' => ['required', 'string', 'max:20'],
            'homeroom_teacher_id' => [
                'nullable',
                'integer',
                'exists:teachers,id',
                'unique:classes,homeroom_teacher_id',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
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
