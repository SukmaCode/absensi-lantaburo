<?php

namespace App\Models;

use Database\Factories\AttendanceTeacherFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['teacher_id', 'date', 'check_in_time', 'status', 'notes'])]
class AttendanceTeacher extends Model
{
    /** @use HasFactory<AttendanceTeacherFactory> */
    use HasFactory;

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
