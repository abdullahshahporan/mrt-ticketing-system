<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class InstantBooking extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'instant_bookings';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'pnr',
        'base_pnr',
        'ticket_number',
        'from_station',
        'to_station',
        'quantity',
        'base_fare',
        'total_fare',
        'status',
        'booking_time',
        'valid_until',
        'used_at',
        'ip_address',
        'user_agent'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'quantity' => 'integer',
        'base_fare' => 'decimal:2',
        'total_fare' => 'decimal:2',
        'booking_time' => 'datetime',
        'valid_until' => 'datetime',
        'used_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Generate unique base PNR with format MRT + 9 digits
     */
    public static function generateBasePNR(): string
    {
        do {
            // Generate 9 random digits
            $digits = str_pad(random_int(0, 999999999), 9, '0', STR_PAD_LEFT);
            $basePnr = 'MRT' . $digits;
            
            // Check if base PNR already exists
            $exists = self::where('base_pnr', $basePnr)->exists();
        } while ($exists);

        return $basePnr;
    }

    /**
     * Generate full PNR with ticket number (e.g., MRT123456789-1)
     */
    public static function generateFullPNR(string $basePnr, int $ticketNumber): string
    {
        return $basePnr . '-' . $ticketNumber;
    }

    /**
     * Check if booking is still valid (within 1 hour)
     */
    public function isValid(): bool
    {
        return $this->status === 'active' && 
               Carbon::now()->lessThan($this->valid_until);
    }

    /**
     * Check if booking has expired
     */
    public function isExpired(): bool
    {
        return Carbon::now()->greaterThan($this->valid_until);
    }

    /**
     * Mark booking as used
     */
    public function markAsUsed(): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        $this->status = 'used';
        $this->used_at = Carbon::now();
        return $this->save();
    }

    /**
     * Mark booking as expired
     */
    public function markAsExpired(): bool
    {
        $this->status = 'expired';
        return $this->save();
    }

    /**
     * Get remaining validity time in minutes
     */
    public function getRemainingMinutes(): int
    {
        if ($this->isExpired()) {
            return 0;
        }

        return Carbon::now()->diffInMinutes($this->valid_until, false);
    }

    /**
     * Scope to get active bookings
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('valid_until', '>', Carbon::now());
    }

    /**
     * Scope to get expired bookings
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'active')
                    ->where('valid_until', '<', Carbon::now());
    }

    /**
     * Get formatted station names
     */
    public function getFromStationNameAttribute(): string
    {
        return $this->formatStationName($this->from_station);
    }

    public function getToStationNameAttribute(): string
    {
        return $this->formatStationName($this->to_station);
    }

    /**
     * Format station ID to readable name
     */
    private function formatStationName(string $stationId): string
    {
        $stations = [
            'uttara_north' => 'Uttara North',
            'uttara_center' => 'Uttara Center',
            'uttara_south' => 'Uttara South',
            'pallabi' => 'Pallabi',
            'mirpur_11' => 'Mirpur 11',
            'mirpur_10' => 'Mirpur 10',
            'kazipara' => 'Kazipara',
            'shewrapara' => 'Shewrapara',
            'agargaon' => 'Agargaon',
            'bijoy_sarani' => 'Bijoy Sarani',
            'farmgate' => 'Farmgate',
            'karwan_bazar' => 'Karwan Bazar',
            'shahbag' => 'Shahbag',
            'dhaka_university' => 'Dhaka University',
            'bangladesh_secretariat' => 'Bangladesh Secretariat',
            'motijheel' => 'Motijheel'
        ];

        return $stations[$stationId] ?? $stationId;
    }
}
