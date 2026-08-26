<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
{
    public function rules(): array
    {
        $studentId = $this->route('id');

        return [
            'nis' => ['required', 'integer', "unique:students,nis,{$studentId}"],
            'class_id' => ['nullable', 'exists:classes,id'],
            'status' => ['required', 'in:active,inactive'],
        ];
    }

    public function messages(): array
    {
        return [
            'nis.required' => 'NIS harus diisi.',
            'nis.unique' => 'NIS sudah terdaftar.',
            'nis.integer' => 'NIS harus berupa angka.',
            'class_id.exists' => 'Kelas tidak valid.',
            'status.required' => 'Status harus dipilih.',
            'status.in' => 'Status tidak valid.',
        ];
    }
}
