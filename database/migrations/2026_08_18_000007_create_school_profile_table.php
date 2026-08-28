<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('school_profile', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200)->nullable();
            $table->string('logo', 150)->nullable();
            $table->string('hero_image', 150)->nullable();
            $table->string('about_image', 150)->nullable();
            $table->string('activities_image_1', 150)->nullable();
            $table->string('activities_image_2', 150)->nullable();
            $table->string('activities_image_3', 150)->nullable();
            $table->text('description_heading')->nullable();
            $table->text('description_body')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_profile');
    }
};
