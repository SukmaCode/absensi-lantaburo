<?php

use App\Http\Admin\DashboardController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('home');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::inertia('absensi', 'absensi')->name('absensi');
    Route::inertia('data-siswa', 'data-siswa')->name('data-siswa');
    Route::inertia('data-guru', 'data-guru')->name('data-guru');
    Route::inertia('pengumuman', 'pengumuman')->name('pengumuman');
});

require __DIR__.'/settings.php';
