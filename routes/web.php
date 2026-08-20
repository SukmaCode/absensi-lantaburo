<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DataSiswaController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landingpage');

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('admin.dashboard');

    Route::inertia('absensi', 'admin/absensi')->name('admin.absensi');
    Route::get('data-siswa', DataSiswaController::class)->name('admin.data-siswa');
    Route::post('data-siswa', [DataSiswaController::class, 'store'])->name('admin.data-siswa.store');
    Route::inertia('data-guru', 'admin/data-guru')->name('admin.data-guru');
    Route::inertia('pengumuman', 'admin/pengumuman')->name('admin.pengumuman');
});

require __DIR__.'/settings.php';
