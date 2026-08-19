<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            'nis' => ['required', 'string', 'max:30', 'unique:students,nis'],
            'class_id' => ['nullable', 'exists:classes,id'],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'parent_name' => ['nullable', 'string', 'max:150'],
            'parent_phone' => ['nullable', 'string', 'max:20'],
            'status' => ['nullable', 'in:active,inactive'],
        ];
    }
}
