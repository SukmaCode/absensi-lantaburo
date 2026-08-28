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
        if (Schema::hasTable('parent') && ! Schema::hasTable('parents')) {
            Schema::rename('parent', 'parents');
        } elseif (! Schema::hasTable('parents')) {
            Schema::create('parents', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('students') && ! Schema::hasColumn('students', 'parent_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->foreignId('parent_id')->nullable()->after('user_id')->constrained('parents')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('students') && Schema::hasColumn('students', 'parent_id')) {
            Schema::table('students', function (Blueprint $table) {
                $table->dropForeign(['parent_id']);
                $table->dropColumn('parent_id');
            });
        }

        Schema::dropIfExists('parents');
    }
};
