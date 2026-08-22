<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnouncementRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'target_role' => ['required', 'in:all,guru,siswa'],
            'published_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul harus diisi.',
            'title.max' => 'Judul maksimal 255 karakter.',
            'content.required' => 'Isi pengumuman harus diisi.',
            'target_role.required' => 'Target penerima harus dipilih.',
            'target_role.in' => 'Target penerima tidak valid.',
            'published_at.date' => 'Tanggal publish tidak valid.',
        ];
    }
}
