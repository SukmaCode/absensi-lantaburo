<?php

namespace Database\Factories;

use App\Models\ParentProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ParentProfile>
 */
class ParentProfileFactory extends Factory
{
    protected $model = ParentProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->asOrangTua(),
        ];
    }
}
