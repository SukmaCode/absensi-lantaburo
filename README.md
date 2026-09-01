# 🏫 Sistem Absensi & Manajemen Homeschooling Lantaburo

Aplikasi sistem informasi akademik, absensi berbasis lokasi (*geolocation*), dan portal pembayaran terpadu untuk **Homeschooling Lantaburo**. Dibangun dengan arsitektur modern berbasis **Laravel**, **Inertia.js v3**, **React 19**, **TypeScript**, dan **Tailwind CSS v4**.

---

## 🚀 Fitur Utama

### 1. 👥 Multi-Role Portal
Sistem mendukung 5 hak akses pengguna dengan alur kerja dan hak akses spesifik:
* **Admin / Staf Tata Usaha**:
  * Dashboard statistik dan rekapitulasi kehadiran (Guru & Siswa).
  * Manajemen Data Master: Siswa, Guru, Orang Tua, dan Kelas (termasuk penugasan Wali Kelas).
  * Manajemen Pengumuman dan Agenda Kegiatan (*Event*).
  * Pengaturan Profil Sekolah (*School Profile / Landing Page CMS*).
  * Pengaturan Notifikasi dan Akun.
* **Guru**:
  * Absensi mandiri (Check-in/Check-out) dengan validasi radius lokasi.
  * Pencatatan dan kelola absensi siswa per kelas binaan.
  * Rekapitulasi absensi siswa dan fitur **Export ke Microsoft Excel** (`.xlsx`).
* **Siswa**:
  * Dashboard aktivitas dan riwayat kehadiran pribadi.
  * Absensi mandiri siswa.
  * Riwayat status pembayaran.
* **Orang Tua**:
  * Monitoring kehadiran harian anak secara *real-time*.
  * Pembayaran Iuran/SPP Bulanan terintegrasi dengan **Midtrans Payment Gateway**.
* **Calon Siswa (PPDB)**:
  * Dashboard pendaftaran peserta didik baru.
  * Pembayaran biaya registrasi online via Midtrans Snap.

### 2. 📍 Presensi & Geolocation
* Validasi lokasi presensi berbasis koordinat GPS & peta interaktif menggunakan **Leaflet / React-Leaflet**.
* Pencegahan absensi di luar radius lokasi yang telah ditentukan.

### 3. 💳 Pembayaran Online (Midtrans Gateway)
* Terintegrasi dengan **Midtrans Snap API** & **Webhook Callback**.
* Pembayaran biaya pendaftaran calon siswa dan SPP bulanan otomatis terverifikasi.

### 4. 📊 Analitik & Antarmuka Modern
* Visualisasi grafik statistik kehadiran dengan **Recharts**.
* Desain UI/UX interaktif berbasis **Tailwind CSS v4** dan **Radix UI Primitives**.
* Animasi *smooth scrolling* menggunakan **Lenis** dan notifikasi *toast* interaktif dengan **Sonner**.

### 5. 🛡️ Keamanan & Autentikasi
* Autentikasi aman menggunakan **Laravel Fortify**.
* Dukungan Two-Factor Authentication (2FA) dan **Passkeys**.
* Proteksi *role-based middleware* untuk setiap endpoint dan rute.

---

## 🛠️ Tech Stack

### Backend
* **Framework**: [Laravel 12 / 13](https://laravel.com/) (PHP 8.3+)
* **Authentication**: [Laravel Fortify](https://laravel.com/docs/fortify)
* **Adapter / Glue**: [Inertia.js v3 (Laravel Adapter)](https://inertiajs.com/)
* **TypeScript Route Helper**: [Laravel Wayfinder](https://github.com/laravel/wayfinder)
* **Payment Gateway**: [Midtrans PHP SDK](https://github.com/Midtrans/midtrans-php)
* **Excel Export**: [Maatwebsite Excel](https://laravel-excel.com/)
* **Testing & Code Quality**: [Pest PHP 4](https://pestphp.com/), [Larastan / PHPStan](https://github.com/larastan/larastan), [Laravel Pint](https://laravel.com/docs/pint)

### Frontend
* **UI Library**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite`
* **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React Icons](https://lucide.dev/)
* **Maps & Geolocation**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
* **Charts**: [Recharts](https://recharts.org/)
* **Build Tool**: [Vite 8](https://vitejs.dev/)

---

## 📋 Persyaratan Sistem (Prerequisites)

Pastikan sistem lokal Anda telah terpasang:
* **PHP** >= 8.3 dengan ekstensi aktif (`pdo`, `mbstring`, `curl`, `gd` / `imagick`, `fileinfo`, `sqlite3` / `pdo_mysql`)
* **Composer** >= 2.2
* **Node.js** >= 20.x & **npm** >= 10.x
* **Database**: SQLite (default), MySQL 8.x, atau PostgreSQL
* **Web Server**: Laragon, XAMPP, Nginx, Apache, atau bawaan `php artisan serve`

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd absensi-lantaburo
```

### 2. Install Dependensi PHP & JavaScript
```bash
composer install
npm install
```

### 3. Konfigurasi Environment (`.env`)
Salin file konfigurasi `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
*(Di Windows PowerShell / CMD: `copy .env.example .env`)*

Generate Application Key:
```bash
php artisan key:generate
```

Sesuaikan konfigurasi koneksi database di `.env`:
```env
DB_CONNECTION=sqlite
# Atau jika menggunakan MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=absensi_lantaburo
# DB_USERNAME=root
# DB_PASSWORD=
```

### 4. Konfigurasi Payment Gateway Midtrans (Opsional / Development)
Tambahkan variabel berikut ke `.env` untuk mengaktifkan pembayaran:
```env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
REGISTRATION_FEE=150000
```

### 5. Migrasi & Seeding Database
Jalankan migrasi tabel dan data awal (*dummy/seeder*):
```bash
php artisan migrate:fresh --seed
```

### 6. Menjalankan Server Development
Anda dapat menjalankan server aplikasi, worker antrean, dan Vite secara bersamaan menggunakan script:
```bash
composer run dev
```

Atau jalankan di terminal terpisah:
```bash
# Terminal 1: Backend Server
php artisan serve

# Terminal 2: Frontend Asset Bundler (Vite)
npm run dev

# Terminal 3: Queue Worker (Opsional, untuk background job & notifikasi)
php artisan queue:listen
```

Buka browser dan akses aplikasi melalui: `http://localhost:8000`

---

## 🔑 Akun Uji Coba Default (Demo Credentials)

Setelah menjalankan `php artisan migrate:fresh --seed`, Anda dapat masuk dengan akun-akun berikut (Password default: `password`):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **Orang Tua** | `orangtua@example.com` | `password` |
| **Guru & Siswa** | Terbuat secara otomatis via seeder | `password` |

---

## 🧪 Pengujian & Kualitas Kode (Testing & QA)

Aplikasi dilengkapi dengan suite pengujian otomatis berbasis **Pest**:

```bash
# Menjalankan seluruh pengujian (Tests, Linting, Type Check)
composer run test

# Menjalankan pengujian Pest saja
php artisan test

# Analisis statis tipe data PHP (Larastan / PHPStan)
composer run types:check

# Pengecekan & perbaikan standar penulisan kode PHP (Pint)
composer run lint

# Pengecekan TypeScript & ESLint pada Frontend
npm run types:check
npm run lint:check
```

---

## 📁 Struktur Direktori Singkat

```text
absensi-lantaburo/
├── app/
│   ├── Actions/Fortify/         # Logika otentikasi & manajemen user Fortify
│   ├── Http/Controllers/        # Controller terbagi per modul (Admin, Guru, Siswa, OrangTua, CalonSiswa)
│   ├── Models/                  # Eloquent Models (User, Attendance, Student, Teacher, Payment, dll)
│   └── Services/                # Service layer (MidtransService, Dashboard, SppPayment)
├── config/                      # File konfigurasi (midtrans.php, fortify.php, dll)
├── database/
│   ├── factories/               # Database model factories
│   ├── migrations/              # Skema tabel database
│   └── seeders/                 # Data inisialisasi / dummy database
├── resources/
│   ├── css/                     # File CSS utama & styling Tailwind
│   ├── js/
│   │   ├── components/          # Komponen UI Reusable (Radix, Landing, Layouts)
│   │   ├── layouts/             # Template layout (AppLayout, AuthLayout)
│   │   ├── pages/               # Halaman antarmuka Inertia React
│   │   └── types/               # Definisi tipe TypeScript
│   └── views/                   # Root Blade template (app.blade.php)
├── routes/                      # Rute aplikasi (web.php, console.php, settings.php)
└── tests/                       # Pengujian otomatis berbasis Pest (Feature & Unit)
```

---

## 📄 Lisensi

Proyek ini berada di bawah lisensi [MIT License](LICENSE).
