<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'event_date' => ['required', 'date'],
            'location' => ['nullable', 'string', 'max:200'],
            'contact_person' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:15'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul kegiatan harus diisi.',
            'title.max' => 'Judul kegiatan maksimal 200 karakter.',
            'event_date.required' => 'Tanggal kegiatan harus diisi.',
            'event_date.date' => 'Format tanggal kegiatan tidak valid.',
            'location.max' => 'Lokasi kegiatan maksimal 200 karakter.',
            'contact_person.max' => 'Nama kontak person maksimal 100 karakter.',
            'phone.max' => 'Nomor telepon maksimal 15 karakter.',
        ];
    }
}
