# Skema Database — Website Absensi Sekolah
**Database:** MySQL (InnoDB, utf8mb4)
**Versi:** 1.0

---

## 1. Daftar Tabel

| Tabel | Fungsi | Modul Terkait |
|---|---|---|
| `users` | Akun login semua peran (siswa/guru/admin) | Autentikasi |
| `students` | Data detail siswa | Kelola Data Siswa |
| `teachers` | Data detail guru | Absen Guru |
| `classes` | Data kelas | Kelola Data Siswa |
| `attendance_students` | Rekam absen siswa | Absen Siswa, Riwayat Absen |
| `attendance_teachers` | Rekam absen guru | Absen Guru, Riwayat Absen |
| `announcements` | Pengumuman sekolah | Dashboard |
| `events` | Agenda/event sekolah | Landing Page |
| `school_profile` | Identitas sekolah | Landing Page |
| `notification_settings` | Preferensi notifikasi pengguna | Pengaturan Akun |
| `password_resets` | Token reset kata sandi | Autentikasi |

---

## 2. Relasi Antar Tabel (Ringkasan)

```
users 1───1 students
users 1───1 teachers
classes 1───* students
teachers 1───1 classes        (wali_kelas, opsional)
students 1───* attendance_students
teachers 1───* attendance_teachers
users 1───* announcements     (created_by)
users 1───1 notification_settings
```

---

## 3. Detail Tabel & DDL

### 3.1 `users`
Menyimpan akun untuk semua peran (siswa, guru, admin).

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | BIGINT UNSIGNED, PK, AUTO_INCREMENT | |
| name | VARCHAR(150) | Nama lengkap |
| email | VARCHAR(150), UNIQUE | Digunakan untuk login |
| password | VARCHAR(255) | Hash password |
| role | ENUM('siswa','guru','admin') | Peran pengguna |
| photo | VARCHAR(255) NULL | Path foto profil |
| phone | VARCHAR(20) NULL | |
| status | ENUM('active','inactive') DEFAULT 'active' | |
| email_verified_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('siswa','guru','admin') NOT NULL,
    photo VARCHAR(255) NULL,
    phone VARCHAR(20) NULL,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.2 `classes`
Data kelas (mis. 7A, 8B, dst).

```sql
CREATE TABLE classes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,          -- contoh: 7A, 8B
    grade_level VARCHAR(20) NOT NULL,   -- contoh: 7, 8, 9
    homeroom_teacher_id BIGINT UNSIGNED NULL, -- wali kelas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_classes_teacher FOREIGN KEY (homeroom_teacher_id)
        REFERENCES teachers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
> Catatan: FK ke `teachers` dibuat setelah tabel `teachers` ada (lihat urutan eksekusi di bagian 5), atau gunakan `ALTER TABLE` belakangan.

---

### 3.3 `students`
Data detail siswa, 1-1 dengan `users`.

```sql
CREATE TABLE students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    nis VARCHAR(30) NOT NULL UNIQUE,     -- Nomor Induk Siswa
    class_id BIGINT UNSIGNED NULL,
    gender ENUM('L','P') NOT NULL,
    birth_date DATE NULL,
    address TEXT NULL,
    parent_name VARCHAR(150) NULL,
    parent_phone VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_students_class FOREIGN KEY (class_id)
        REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.4 `teachers`
Data detail guru, 1-1 dengan `users`.

```sql
CREATE TABLE teachers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    nip VARCHAR(30) NULL UNIQUE,          -- Nomor Induk Pegawai
    subject VARCHAR(100) NULL,            -- mata pelajaran utama
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.5 `attendance_students`
Rekam absen masuk/pulang siswa per hari.

```sql
CREATE TABLE attendance_students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    status ENUM('hadir','terlambat','izin','sakit','alpha') NOT NULL DEFAULT 'hadir',
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_student FOREIGN KEY (student_id)
        REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_date (student_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
> `UNIQUE KEY uq_student_date` mencegah siswa absen dobel di tanggal yang sama.

---

### 3.6 `attendance_teachers`
Rekam absen masuk/pulang guru per hari.

```sql
CREATE TABLE attendance_teachers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    status ENUM('hadir','terlambat','izin','sakit','alpha') NOT NULL DEFAULT 'hadir',
    notes VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_teacher FOREIGN KEY (teacher_id)
        REFERENCES teachers(id) ON DELETE CASCADE,
    UNIQUE KEY uq_teacher_date (teacher_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.7 `announcements`
Pengumuman sekolah yang tampil di dashboard.

```sql
CREATE TABLE announcements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    target_role ENUM('all','siswa','guru') NOT NULL DEFAULT 'all',
    created_by BIGINT UNSIGNED NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_user FOREIGN KEY (created_by)
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.8 `events`
Agenda/event sekolah yang tampil di landing page.

```sql
CREATE TABLE events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    event_date DATE NOT NULL,
    location VARCHAR(200) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.9 `school_profile`
Identitas sekolah (tabel single-row, biasanya hanya 1 baris data).

```sql
CREATE TABLE school_profile (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    logo VARCHAR(255) NULL,
    description TEXT NULL,
    address TEXT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.10 `notification_settings`
Preferensi notifikasi per pengguna (modul Pengaturan Akun).

```sql
CREATE TABLE notification_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    email_notification BOOLEAN NOT NULL DEFAULT TRUE,
    push_notification BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 3.11 `password_resets`
Token untuk fitur lupa/reset kata sandi (modul Autentikasi).

```sql
CREATE TABLE password_resets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_password_resets_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 4. Catatan Desain

- **Pemisahan `users` dari `students`/`teachers`**: mempermudah proses autentikasi (satu tabel login untuk semua peran) sambil tetap punya data spesifik per peran di tabel terpisah.
- **`UNIQUE (student_id, date)` / `(teacher_id, date)`**: menjamin satu orang hanya punya satu baris absensi per hari; kolom `check_in_time` dan `check_out_time` diisi terpisah saat absen masuk vs pulang (bukan insert baris baru).
- **Status kehadiran** memakai `ENUM` agar konsisten dengan kebutuhan "Status kehadiran" di PRD (hadir, terlambat, izin, sakit, alpha).
- **`target_role`** pada `announcements` mendukung kebutuhan "Menu sesuai peran" — pengumuman bisa ditarget ke semua atau peran tertentu.
- Dua sub-fitur yang masih diasumsikan dari PRD (hapus data siswa, reset password) sudah terakomodasi lewat kolom `status` di `students`/`users` (nonaktifkan, bukan hard delete) dan tabel `password_resets`.

## 5. Urutan Eksekusi (untuk menghindari error FK)

Karena ada saling ketergantungan (`classes` ↔ `teachers`), jalankan dalam urutan berikut:

1. `users`
2. `teachers`
3. `classes` (tanpa FK ke teachers dulu, atau buat FK lewat `ALTER TABLE` setelah `teachers` ada)
4. `students`
5. `attendance_students`
6. `attendance_teachers`
7. `announcements`
8. `events`
9. `school_profile`
10. `notification_settings`
11. `password_resets`

File `.sql` siap-eksekusi dengan urutan yang benar tersedia terpisah di **skema-absensi-sekolah.sql**.
