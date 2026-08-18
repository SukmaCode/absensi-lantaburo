---
paths:
  - 'database/migrations/**'
---

# Migrations

## users.role default siswa untuk kompatibilitas Fortify
users.role ENUM('siswa','guru','admin') sengaja ber-default 'siswa' (skema .sql tanpa default) karena Fortify/UserFactory membuat user tanpa kolom role. Kolom two_factor_* wajib ada di migrasi users karena dihapus dari setahun lalu namun masih dipakai Fortify.
