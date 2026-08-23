<?php

use App\Http\Controllers\Admin\AbsensiController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DataGuruController;
use App\Http\Controllers\Admin\DataSiswaController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\Admin\SchoolProfileController;
use App\Http\Controllers\Guru\AbsenGuruController;
use App\Http\Controllers\Guru\AbsenMuridController;
use App\Http\Controllers\Guru\RekapMuridController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MidtransWebhookController;
use App\Http\Controllers\Siswa\AbsenSiswaController;
use App\Http\Controllers\Siswa\PaymentController as SiswaPaymentController;
use App\Http\Controllers\Siswa\PengaturanAkunController as SiswaPengaturanAkunController;
use App\Http\Controllers\Siswa\RiwayatSiswaController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landingpage');
Route::post('api/midtrans/callback', MidtransWebhookController::class)->name('midtrans.callback');

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('admin.dashboard');

    Route::get('absensi', AbsensiController::class)->name('admin.absensi');

    Route::get('data-siswa', DataSiswaController::class)->name('admin.data-siswa');
    Route::post('data-siswa', [DataSiswaController::class, 'create'])->name('admin.data-siswa.store');

    Route::get('data-guru', DataGuruController::class)->name('admin.data-guru');
    Route::post('data-guru', [DataGuruController::class, 'create'])->name('admin.data-guru.create');

    Route::get('pengumuman', PengumumanController::class)->name('admin.pengumuman');
    Route::post('pengumuman', [PengumumanController::class, 'store'])->name('admin.pengumuman.store');
    Route::put('pengumuman/{id}', [PengumumanController::class, 'update'])->name('admin.pengumuman.update');
    Route::delete('pengumuman/{id}', [PengumumanController::class, 'destroy'])->name('admin.pengumuman.destroy');

    Route::get('school-profile', SchoolProfileController::class)->name('admin.school-profile');
    Route::put('school-profile/{id}', [SchoolProfileController::class, 'update'])->name('admin.school-profile.update');
});

Route::middleware(['auth', 'verified', 'teacher'])->prefix('guru')->group(function () {
    Route::get('dashboard', App\Http\Controllers\Guru\DashboardController::class)->name('guru.dashboard');

    Route::get('absen', AbsenGuruController::class)->name('guru.absen');
    Route::post('absen', [AbsenGuruController::class, 'store'])->name('guru.absen.store');

    Route::get('absen-murid', AbsenMuridController::class)->name('guru.absen-murid');
    Route::post('absen-murid', [AbsenMuridController::class, 'store'])->name('guru.absen-murid.store');

    Route::get('rekap-murid', RekapMuridController::class)->name('guru.rekap-murid');
});

Route::middleware(['auth', 'verified', 'student'])->prefix('siswa')->group(function () {
    Route::get('dashboard', App\Http\Controllers\Siswa\DashboardController::class)->name('siswa.dashboard');

    Route::get('absen', AbsenSiswaController::class)->name('siswa.absen');
    Route::post('absen', [AbsenSiswaController::class, 'store'])->name('siswa.absen.store');

    Route::get('riwayat', RiwayatSiswaController::class)->name('siswa.riwayat');
    Route::post('payment/snap-token', [SiswaPaymentController::class, 'getSnapToken'])->name('siswa.payment.snap-token');
    Route::post('payment/check-status', [SiswaPaymentController::class, 'checkStatus'])->name('siswa.payment.check-status');

    Route::get('pengaturan', [SiswaPengaturanAkunController::class, 'edit'])->name('siswa.pengaturan');
    Route::post('pengaturan', [SiswaPengaturanAkunController::class, 'update'])->name('siswa.pengaturan.update');
    Route::put('pengaturan/password', [SiswaPengaturanAkunController::class, 'updatePassword'])->name('siswa.pengaturan.password');
});

require __DIR__.'/settings.php';
