<?php

namespace App\Models;

use Database\Factories\AttendanceStudentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['student_id', 'date', 'check_in_time', 'status', 'notes'])]
class AttendanceStudent extends Model
{
    /** @use HasFactory<AttendanceStudentFactory> */
    use HasFactory;

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
