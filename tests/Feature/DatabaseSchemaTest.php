<?php

use Illuminate\Support\Facades\Schema;

test('semua tabel skema absensi sekolah dibuat', function () {
    $tables = [
        'teachers',
        'classes',
        'students',
        'attendance_students',
        'attendance_teachers',
        'announcements',
        'events',
        'school_profile',
        'notification_settings',
    ];

    foreach ($tables as $table) {
        expect(Schema::hasTable($table))->toBeTrue("Tabel [{$table}] tidak ditemukan.");
    }
});

test('tabel users memiliki kolom tambahan sesuai skema', function () {
    $columns = ['role', 'photo', 'phone', 'status'];

    foreach ($columns as $column) {
        expect(Schema::hasColumn('users', $column))->toBeTrue("Kolom [users.{$column}] tidak ditemukan.");
    }
});
