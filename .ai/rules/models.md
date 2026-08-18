---
paths:
  - 'app/Models/*.php'
---

# Models

## Model dengan nama tabel non-standar dari skema SQL
SchoolProfile → $table = 'school_profile' dan SchoolClass → $table = 'classes' karena nama tabel mengikuti skema SQL (tidak plural standar). Wajib cek nama tabel aktual saat membuat model baru dari skema.
