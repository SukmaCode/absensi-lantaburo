<?php

namespace App\Models;

use Database\Factories\SchoolProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'logo',
    'hero_image',
    'about_image',
    'activities_image_1',
    'activities_image_2',
    'activities_image_3',
    'description_heading',
    'description_body',
    'address',
    'phone',
    'email',
])]
class SchoolProfile extends Model
{
    /** @use HasFactory<SchoolProfileFactory> */
    use HasFactory;

    protected $table = 'school_profile';
}
