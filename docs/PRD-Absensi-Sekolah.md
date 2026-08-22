# Product Requirements Document (PRD)
# Website Absensi Sekolah

## 1. Ringkasan Produk

Website Absensi Sekolah adalah sistem berbasis web yang digunakan untuk mengelola presensi harian siswa dan guru di sebuah sekolah. Sistem ini menggantikan pencatatan absensi manual dengan platform digital yang menyediakan dashboard, riwayat kehadiran, dan pengelolaan data pengguna, serta landing page publik sebagai etalase informasi sekolah.

## 2. Latar Belakang & Masalah

- Pencatatan absensi manual rentan human error, sulit direkap, dan tidak real-time.
- Sekolah membutuhkan satu portal terpusat untuk informasi sekolah (landing page) sekaligus operasional absensi harian.
- Guru dan admin membutuhkan rekap kehadiran yang cepat diakses tanpa harus membuka buku/absensi fisik.

## 3. Tujuan Produk

1. Menyediakan proses absen masuk yang cepat dan akurat untuk siswa dan guru.
2. Menyediakan dashboard ringkas sesuai peran pengguna (siswa, guru, admin).
3. Menyediakan riwayat dan rekap kehadiran yang dapat difilter per tanggal/bulan.
4. Menyediakan landing page publik yang menampilkan identitas sekolah dan agenda/event.
5. Menyediakan pengelolaan data siswa dan akun pengguna yang aman.

## 4. Target Pengguna (User Roles)

| Peran | Deskripsi |
|---|---|
|DONE| Pengunjung/Calon Siswa | Mengakses landing page untuk melihat info sekolah & agenda |
| Siswa | Melakukan absen masuk, melihat riwayat kehadiran sendiri |
| Guru | Melakukan absen masuk, melihat rekap harian, mengelola data siswa |
|DONE| Admin/Staf Sekolah | Mengelola data siswa, akun, pengumuman, dan memantau seluruh absensi |

## 5. Ruang Lingkup & Fase Pengembangan

Pengembangan dibagi menjadi 4 fase berdasarkan prioritas fitur:

| Fase | Modul |
|---|---|
| Fase 1 | Landing Page Sekolah, Dashboard |
| Fase 2 | Absen Siswa, Absen Guru, Riwayat Absen |
| Fase 3 | Kelola Data Siswa, Autentikasi |
| Fase 4 | Pengaturan Akun |

---

## 6. Detail Fitur per Modul

### FASE 1

#### 6.1 Landing Page Sekolah
Halaman publik yang menjadi wajah sekolah di internet. |DONE|

**Sub Fitur:**
- Tampilkan identitas sekolah (nama, logo, profil singkat) |DONE|
- Daftar agenda/event sekolah |DONE|
- Tombol masuk/daftar (akses ke sistem login/registrasi) |DONE|

**Functional Requirements:**
- FR-1.1: Sistem menampilkan informasi identitas sekolah secara statis/dikelola admin. |DONE|
- FR-1.2: Sistem menampilkan daftar agenda/event terbaru. |DONE|
- FR-1.3: Sistem menyediakan tombol navigasi ke halaman login dan pendaftaran. |DONE|

#### 6.2 Dashboard
Halaman utama setelah pengguna login, tampilan menyesuaikan peran.

**Sub Fitur:**
- Ringkasan kehadiran harian
- Menu sesuai peran (role-based menu)
- Pengumuman sekolah

**Functional Requirements:**
- FR-2.1: Sistem menampilkan ringkasan status kehadiran hari itu untuk pengguna yang login.
- FR-2.2: Sistem menampilkan menu navigasi berbeda untuk siswa, guru, dan admin.
- FR-2.3: Sistem menampilkan daftar pengumuman terbaru dari sekolah.

---

### FASE 2

#### 6.3 Absen Siswa
**Sub Fitur:**
- Absen masuk
- Absen pulang
- Status kehadiran

**Functional Requirements:**
- FR-3.1: Siswa dapat melakukan absen masuk dengan pencatatan waktu otomatis.
- FR-3.2: Siswa dapat melakukan absen pulang dengan pencatatan waktu otomatis.
- FR-3.3: Sistem menampilkan status kehadiran (Hadir/Terlambat/Tidak Hadir/Izin/Sakit) secara real-time.

#### 6.4 Absen Guru
**Sub Fitur:**
- Absen masuk guru
- Absen pulang guru
- Rekap harian guru

**Functional Requirements:**
- FR-4.1: Guru dapat melakukan absen masuk dengan pencatatan waktu otomatis.
- FR-4.2: Guru dapat melakukan absen pulang dengan pencatatan waktu otomatis.
- FR-4.3: Sistem menyediakan rekap kehadiran guru per hari.

#### 6.5 Riwayat Absen
**Sub Fitur:**
- Riwayat per tanggal
- Detail harian
- Filter bulan

**Functional Requirements:**
- FR-5.1: Pengguna dapat melihat riwayat absensi berdasarkan tanggal tertentu.
- FR-5.2: Pengguna dapat melihat detail kehadiran harian (jam masuk, jam pulang, status).
- FR-5.3: Pengguna dapat memfilter riwayat berdasarkan bulan.

---

### FASE 3

#### 6.6 Kelola Data Siswa
**Sub Fitur:**
- Tambah siswa
- Ubah data siswa
- Cari siswa
- *(1 sub fitur tambahan tidak terbaca jelas pada gambar — asumsi: Hapus/nonaktifkan data siswa, perlu dikonfirmasi)*

**Functional Requirements:**
- FR-6.1: Admin dapat menambahkan data siswa baru ke sistem.
- FR-6.2: Admin dapat mengubah data siswa yang sudah ada.
- FR-6.3: Admin/guru dapat mencari data siswa berdasarkan nama/NIS/kelas.
- FR-6.4: Admin dapat menghapus atau menonaktifkan data siswa *(perlu konfirmasi)*.

#### 6.7 Autentikasi
**Sub Fitur:**
- Daftar akun |DONE|
- Login |DONE|
- Logout |DONE|
- *(1 sub fitur tambahan tidak terbaca jelas pada gambar — asumsi: Reset/lupa kata sandi, perlu dikonfirmasi)*

**Functional Requirements:**
- FR-7.1: Pengguna baru dapat mendaftarkan akun. |DONE|
- FR-7.2: Pengguna dapat login menggunakan kredensial yang valid. |UNFINISHED|
- FR-7.3: Pengguna dapat logout dari sistem. |DONE|
- FR-7.4: Pengguna dapat mereset kata sandi jika lupa *(perlu konfirmasi)*.

---

### FASE 4

#### 6.8 Pengaturan Akun
**Sub Fitur:**
- Profil saya |DONE|
- Ganti kata sandi |DONE|
- Notifikasi |UNFINISHED|

**Functional Requirements:**
- FR-8.1: Pengguna dapat melihat dan mengubah data profil pribadi. |DONE|
- FR-8.2: Pengguna dapat mengganti kata sandi akun. |UNFINISHED|
- FR-8.3: Pengguna dapat mengatur preferensi notifikasi. |UNFINISHED|

---

## 7. Non-Functional Requirements (Asumsi)

- **Keamanan:** Password disimpan dalam bentuk hash, sesi login menggunakan token/session yang aman. |DONE|
- **Performa:** Halaman dashboard dan absensi harus responsif (< 2 detik loading pada koneksi normal).
- **Ketersediaan:** Sistem idealnya dapat diakses selama jam operasional sekolah tanpa downtime.
- **Kompatibilitas:** Dapat diakses melalui desktop dan mobile browser (responsive design). |DONE|
- **Audit Trail:** Setiap aksi absen tercatat dengan timestamp yang tidak dapat diubah oleh pengguna biasa. |DONE|

## 8. Asumsi & Batasan

- Dokumen ini disusun berdasarkan mindmap perencanaan fitur (belum ada wireframe/UI detail).
- Dua sub-fitur (pada modul *Kelola Data Siswa* dan *Autentikasi*) tidak sepenuhnya terlihat pada gambar sumber ("Lihat semua (4)" menunjukkan ada 4 sub-fitur, sementara hanya 3 yang tampak) — perlu validasi ke tim/pemilik produk.
- Metode absensi (manual klik, QR code, GPS, atau lainnya) belum didefinisikan di mindmap — perlu diklarifikasi sebelum masuk ke desain teknis.
- Dokumen belum mencakup kebutuhan integrasi pihak ketiga (misalnya notifikasi WhatsApp/SMS ke orang tua), jika dibutuhkan bisa ditambahkan sebagai fase lanjutan.

## 9. Roadmap Ringkas

| Fase | Fokus | Output |
|---|---|---|
| Fase 1 | Fondasi tampilan publik & dashboard | Landing page + dashboard role-based | |DONE|
| Fase 2 | Inti fungsi absensi | Absen siswa, absen guru, riwayat absen |
| Fase 3 | Manajemen data & akses | CRUD data siswa, sistem autentikasi | |DONE|
| Fase 4 | Personalisasi akun | Profil, keamanan akun, notifikasi | |UNFINISHED|

## 10. Metrik Keberhasilan (Saran)

- % siswa/guru yang berhasil absen tanpa kendala teknis per hari.
- Waktu rata-rata proses absen (target: di bawah 5 detik per aksi).
- Tingkat penggunaan riwayat absen oleh admin/guru untuk rekap bulanan.
- Pengurangan waktu rekap manual dibanding sistem sebelumnya.

---

*Dokumen ini disusun berdasarkan mindmap perencanaan fitur yang diberikan. Beberapa detail (metode absen, sub-fitur yang tersembunyi) memerlukan klarifikasi lebih lanjut sebelum masuk ke tahap desain teknis/UI.*
