<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DataSiswaController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landingpage');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/admin/dashboard', DashboardController::class)->name('dashboard');

    Route::inertia('/admin/absensi', 'admin/absensi')->name('absensi');
    Route::get('/admin/data-siswa', DataSiswaController::class)->name('data-siswa');
    Route::post('/admin/data-siswa', [DataSiswaController::class, 'store'])->name('data-siswa.store');
    Route::inertia('/admin/data-guru', 'admin/data-guru')->name('data-guru');
    Route::inertia('/admin/pengumuman', 'admin/pengumuman')->name('pengumuman');
});

require __DIR__.'/settings.php';
