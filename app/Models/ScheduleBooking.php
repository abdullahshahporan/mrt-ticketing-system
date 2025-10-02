<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class ScheduleBooking extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'schedule_bookings';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'pnr',
        'base_pnr',
        'ticket_number',
        'contact_number',
        'from_station',
        'to_station',
        'quantity',
        'base_fare',
        'total_fare',
        'travel_date',
        'time_slot',
        'status',
        'booking_time',
        'valid_from',
        'valid_until',
        'used_at'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'quantity' => 'integer',
        'base_fare' => 'decimal:2',
        'total_fare' => 'decimal:2',
        'travel_date' => 'date',
        'booking_time' => 'datetime',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'used_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Generate unique base PNR with format MRT + 9 digits (same as instant booking)
     */
    public static function generateBasePNR(): string
    {
        do {
            // Generate 9 random digits (0-9 combination)
            $digits = str_pad(random_int(0, 999999999), 9, '0', STR_PAD_LEFT);
            $basePnr = 'MRT' . $digits; // MRT prefix same as instant booking
            
            // Check if base PNR already exists in both instant and schedule tables
            $existsInInstant = \App\Models\InstantBooking::where('base_pnr', $basePnr)->exists();
            $existsInSchedule = self::where('base_pnr', $basePnr)->exists();
        } while ($existsInInstant || $existsInSchedule);

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
     * Check if booking is still valid
     */
    public function isValid(): bool
    {
        $now = Carbon::now('Asia/Dhaka');
        return $this->status === 'scheduled' &&
               $now->greaterThanOrEqualTo($this->valid_from) &&
               $now->lessThanOrEqualTo($this->valid_until);
    }

    /**
     * Check if booking has expired
     */
    public function isExpired(): bool
    {
        return Carbon::now('Asia/Dhaka')->greaterThan($this->valid_until);
    }

    /**
     * Mark booking as used
     */
    public function markAsUsed(): bool
    {
        $this->status = 'used';
        $this->used_at = Carbon::now('Asia/Dhaka');
        return $this->save();
    }

    /**
     * Get time slot display name
     */
    public function getTimeSlotName(): string
    {
        $slots = [
            'morning_early' => 'Morning Early (06:00 AM - 09:00 AM)',
            'morning_late' => 'Morning Late (09:00 AM - 12:00 PM)',
            'afternoon' => 'Afternoon (12:00 PM - 03:00 PM)',
            'evening' => 'Evening (03:00 PM - 06:00 PM)',
            'night' => 'Night (06:00 PM - 09:00 PM)',
        ];

        return $slots[$this->time_slot] ?? 'Unknown';
    }

    /**
     * Scope: Get bookings by base PNR
     */
    public function scopeByBasePnr($query, string $basePnr)
    {
        return $query->where('base_pnr', $basePnr);
    }

    /**
     * Scope: Get active bookings
     */
    public function scopeActive($query)
    {
        // 'active' concept = 'scheduled' and not yet expired
        return $query->where('status', 'scheduled')
                     ->where('valid_until', '>=', Carbon::now('Asia/Dhaka'));
    }

    /**
     * Scope: Get bookings for a specific date
     */
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('travel_date', $date);
    }

    /**
     * Scope: Get bookings for a specific time slot
     */
    public function scopeForTimeSlot($query, string $timeSlot)
    {
        return $query->where('time_slot', $timeSlot);
    }

    /**
     * Scope: Get upcoming bookings (next 24 hours)
     */
    public function scopeUpcoming($query, int $hours = 24)
    {
        $now = Carbon::now('Asia/Dhaka');
        return $query->where('valid_from', '>', $now)
                    ->where('valid_from', '<=', $now->copy()->addHours($hours))
                    ->where('status', 'scheduled');
    }

    /**
     * Get formatted station names
     */
    public function getFromStationNameAttribute(): string
    {
        return \App\Services\FareService::getStationName($this->from_station);
    }

    public function getToStationNameAttribute(): string
    {
        return \App\Services\FareService::getStationName($this->to_station);
    }

    /**
     * Get all tickets for this base PNR
     */
    public static function getTicketsByBasePnr(string $basePnr)
    {
        return self::where('base_pnr', $basePnr)
                  ->orderBy('ticket_number')
                  ->get();
    }
}
