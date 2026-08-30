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
        Schema::create('payment_spp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('order_id', 100)->unique();
            $table->unsignedInteger('amount');
            $table->string('month', 7); // format: YYYY-MM
            $table->string('status', 30)->default('pending'); // pending, success, expired, failed, cancelled
            $table->string('payment_type', 50)->nullable();
            $table->string('snap_token', 255)->nullable();
            $table->string('payment_url', 500)->nullable();
            $table->timestamp('settlement_time')->nullable();
            $table->json('raw_response')->nullable();
            $table->timestamps();

            // Satu siswa hanya boleh membayar satu kali per bulan
            $table->unique(['student_id', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_spp');
    }
};
