<?php

use App\Http\Controllers\Admin\AbsensiController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DataGuruController;
use App\Http\Controllers\Admin\DataKelasController;
use App\Http\Controllers\Admin\DataOrangTuaController;
use App\Http\Controllers\Admin\DataSiswaController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\PengaturanAkunController as AdminPengaturanAkunController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\Admin\SchoolProfileController;
use App\Http\Controllers\CalonSiswa\PaymentController;
use App\Http\Controllers\Guru\AbsenGuruController;
use App\Http\Controllers\Guru\AbsenMuridController;
use App\Http\Controllers\Guru\AttendanceStudentExportController;
use App\Http\Controllers\Guru\PengaturanAkunController as GuruPengaturanAkunController;
use App\Http\Controllers\Guru\RekapMuridController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MidtransWebhookController;
use App\Http\Controllers\OrangTua\AbsenAnakController;
use App\Http\Controllers\OrangTua\PengaturanAkunController;
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

    Route::get('data-kelas', DataKelasController::class)->name('admin.data-kelas');
    Route::post('data-kelas', [DataKelasController::class, 'store'])->name('admin.data-kelas.store');
    Route::put('data-kelas/{id}', [DataKelasController::class, 'update'])->name('admin.data-kelas.update');
    Route::delete('data-kelas/{id}/wali-kelas', [DataKelasController::class, 'destroyHomeroomTeacher'])->name('admin.data-kelas.destroy-homeroom-teacher');

    Route::get('data-siswa', DataSiswaController::class)->name('admin.data-siswa');
    Route::post('data-siswa', [DataSiswaController::class, 'create'])->name('admin.data-siswa.store');
    Route::put('data-siswa/{id}', [DataSiswaController::class, 'update'])->name('admin.data-siswa.update');

    Route::get('data-guru', DataGuruController::class)->name('admin.data-guru');
    Route::post('data-guru', [DataGuruController::class, 'create'])->name('admin.data-guru.create');
    Route::put('data-guru/{id}', [DataGuruController::class, 'update'])->name('admin.data-guru.update');
    Route::delete('data-guru/{id}', [DataGuruController::class, 'destroy'])->name('admin.data-guru.destroy');

    Route::get('data-orangtua', DataOrangTuaController::class)->name('admin.data-orangtua');
    Route::post('data-orangtua', [DataOrangTuaController::class, 'store'])->name('admin.data-orangtua.store');
    Route::put('data-orangtua/{id}', [DataOrangTuaController::class, 'update'])->name('admin.data-orangtua.update');
    Route::delete('data-orangtua/{id}', [DataOrangTuaController::class, 'destroy'])->name('admin.data-orangtua.destroy');

    Route::get('pengumuman', PengumumanController::class)->name('admin.pengumuman');
    Route::post('pengumuman', [PengumumanController::class, 'store'])->name('admin.pengumuman.store');
    Route::put('pengumuman/{id}', [PengumumanController::class, 'update'])->name('admin.pengumuman.update');
    Route::delete('pengumuman/{id}', [PengumumanController::class, 'destroy'])->name('admin.pengumuman.destroy');

    Route::get('school-profile', SchoolProfileController::class)->name('admin.school-profile');
    Route::put('school-profile/{id}', [SchoolProfileController::class, 'update'])->name('admin.school-profile.update');

    Route::get('event', EventController::class)->name('admin.event');
    Route::post('event', [EventController::class, 'store'])->name('admin.event.store');
    Route::put('event/{id}', [EventController::class, 'update'])->name('admin.event.update');
    Route::delete('event/{id}', [EventController::class, 'destroy'])->name('admin.event.destroy');

    Route::get('pengaturan', [AdminPengaturanAkunController::class, 'edit'])->name('admin.pengaturan');
    Route::post('pengaturan', [AdminPengaturanAkunController::class, 'update'])->name('admin.pengaturan.update');
    Route::put('pengaturan/password', [AdminPengaturanAkunController::class, 'updatePassword'])->name('admin.pengaturan.password');
});

Route::middleware(['auth', 'verified', 'teacher'])->prefix('guru')->group(function () {
    Route::get('dashboard', App\Http\Controllers\Guru\DashboardController::class)->name('guru.dashboard');

    Route::get('absen', AbsenGuruController::class)->name('guru.absen');
    Route::post('absen', [AbsenGuruController::class, 'store'])->name('guru.absen.store');

    Route::get('absen-murid', AbsenMuridController::class)->name('guru.absen-murid');
    Route::post('absen-murid', [AbsenMuridController::class, 'store'])->name('guru.absen-murid.store');

    Route::get('rekap-murid', RekapMuridController::class)->name('guru.rekap-murid');
    Route::get('rekap-murid/export', [AttendanceStudentExportController::class, 'export'])->name('guru.rekap-murid.export');

    Route::get('pengaturan', [GuruPengaturanAkunController::class, 'edit'])->name('guru.pengaturan');
    Route::post('pengaturan', [GuruPengaturanAkunController::class, 'update'])->name('guru.pengaturan.update');
    Route::put('pengaturan/password', [GuruPengaturanAkunController::class, 'updatePassword'])->name('guru.pengaturan.password');
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

Route::middleware(['auth', 'verified'])->prefix('calon-siswa')->group(function () {
    Route::get('dashboard', App\Http\Controllers\CalonSiswa\DashboardController::class)->name('calon-siswa.dashboard');
    Route::post('payment/snap-token', [PaymentController::class, 'getSnapToken'])->name('calon-siswa.payment.snap-token');
    Route::post('payment/check-status', [PaymentController::class, 'checkStatus'])->name('calon-siswa.payment.check-status');
});

Route::middleware(['auth', 'verified', 'parent'])->prefix('orangtua')->group(function () {
    Route::get('dashboard', App\Http\Controllers\OrangTua\DashboardController::class)->name('orangtua.dashboard');

    Route::get('absen-anak', AbsenAnakController::class)->name('orangtua.absen-anak');

    Route::get('pengaturan', [PengaturanAkunController::class, 'edit'])->name('orangtua.pengaturan');
    Route::post('pengaturan', [PengaturanAkunController::class, 'update'])->name('orangtua.pengaturan.update');
    Route::put('pengaturan/password', [PengaturanAkunController::class, 'updatePassword'])->name('orangtua.pengaturan.password');
});

require __DIR__.'/settings.php';
