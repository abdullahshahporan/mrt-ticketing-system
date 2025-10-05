<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualCardTransaction extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'virtual_card_id',
        'type',
        'amount',
        'payment_method',
        'transaction_id',
        'status',
        'description',
        'from_station',
        'to_station',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
    ];
    
    /**
     * Get the virtual card that owns the transaction.
     */
    public function virtualCard()
    {
        return $this->belongsTo(VirtualCard::class);
    }
    
    /**
     * Generate a unique transaction ID.
     */
    public static function generateTransactionId($prefix = 'TXN')
    {
        return $prefix . '-' . time() . '-' . rand(1000, 9999);
    }
}