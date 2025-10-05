<?php

namespace App\Models;

use App\Models\VirtualCardProfile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualCardPayment extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'amount',
        'payment_method',
        'transaction_id',
        'status',
        'paid_at',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];
    
    /**
     * Get the profile that owns the payment.
     */
    public function profile()
    {
        return $this->belongsTo(VirtualCardProfile::class, 'profile_id');
    }
    
    /**
     * Generate a unique transaction ID.
     */
    public static function generateTransactionId()
    {
        return 'TXN-' . time() . '-' . rand(1000, 9999);
    }
}
