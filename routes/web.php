<?php

use App\Http\Controllers\Admin\AbsensiController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DataGuruController;
use App\Http\Controllers\Admin\DataSiswaController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\Admin\SchoolProfileController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landingpage');

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('admin.dashboard');

    Route::get('absensi', AbsensiController::class)->name('admin.absensi');

    Route::get('data-siswa', DataSiswaController::class)->name('admin.data-siswa');
    Route::post('data-siswa', [DataSiswaController::class, 'create'])->name('admin.data-siswa.create');

    Route::get('data-guru', DataGuruController::class)->name('admin.data-guru');
    Route::post('data-guru', [DataGuruController::class, 'create'])->name('admin.data-guru.create');

    Route::get('pengumuman', PengumumanController::class)->name('admin.pengumuman');
    Route::post('pengumuman', [PengumumanController::class, 'store'])->name('admin.pengumuman.store');
    Route::put('pengumuman/{id}', [PengumumanController::class, 'update'])->name('admin.pengumuman.update');
    Route::delete('pengumuman/{id}', [PengumumanController::class, 'destroy'])->name('admin.pengumuman.destroy');

    Route::get('school-profile', SchoolProfileController::class)->name('admin.school-profile');
    Route::put('school-profile/{id}', [SchoolProfileController::class, 'update'])->name('admin.school-profile.update');
});

require __DIR__.'/settings.php';
