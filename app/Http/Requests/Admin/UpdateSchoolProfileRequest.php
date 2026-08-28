<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSchoolProfileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:200'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'hero_image' => ['nullable', 'image', 'max:2048'],
            'about_image' => ['nullable', 'image', 'max:2048'],
            'activities_image_1' => ['nullable', 'image', 'max:2048'],
            'activities_image_2' => ['nullable', 'image', 'max:2048'],
            'activities_image_3' => ['nullable', 'image', 'max:2048'],
            'description_heading' => ['nullable', 'string'],
            'description_body' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:150'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Nama maksimal 200 karakter.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.max' => 'Ukuran logo maksimal 2 MB.',
            'hero_image.image' => 'Hero image harus berupa gambar.',
            'hero_image.max' => 'Ukuran hero image maksimal 2 MB.',
            'about_image.image' => 'About image harus berupa gambar.',
            'about_image.max' => 'Ukuran about image maksimal 2 MB.',
            'activities_image_1.image' => 'Activity image 1 harus berupa gambar.',
            'activities_image_1.max' => 'Ukuran activity image 1 maksimal 2 MB.',
            'activities_image_2.image' => 'Activity image 2 harus berupa gambar.',
            'activities_image_2.max' => 'Ukuran activity image 2 maksimal 2 MB.',
            'activities_image_3.image' => 'Activity image 3 harus berupa gambar.',
            'activities_image_3.max' => 'Ukuran activity image 3 maksimal 2 MB.',
            'phone.max' => 'Nomor telepon maksimal 20 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal 150 karakter.',
        ];
    }
}
