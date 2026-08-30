<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $student_id
 * @property string $order_id
 * @property int $amount
 * @property string $month
 * @property string $status
 * @property string|null $payment_type
 * @property string|null $snap_token
 * @property string|null $payment_url
 * @property Carbon|null $settlement_time
 * @property array|null $raw_response
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Student|null $student
 */
#[Fillable([
    'student_id',
    'order_id',
    'amount',
    'month',
    'status',
    'payment_type',
    'snap_token',
    'payment_url',
    'settlement_time',
    'raw_response',
])]
class PaymentSpp extends Model
{
    use HasFactory;

    protected $table = 'payment_spp';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'integer',
            'settlement_time' => 'datetime',
            'raw_response' => 'array',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function isPaid(): bool
    {
        return in_array($this->status, ['success', 'settlement', 'capture'], true);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
