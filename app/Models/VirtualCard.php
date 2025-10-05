<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualCard extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'contact_no',
        'nid_no',
        'date_of_birth',
        'card_number',
        'is_active',
        'balance',
        'hold_balance',
        'last_payment_method',
        'last_transaction_id',
        'last_paid_at',
        'last_used_at',
        'expiry_date',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
        'balance' => 'float',
        'hold_balance' => 'float',
        'last_paid_at' => 'datetime',
        'last_used_at' => 'datetime',
        'expiry_date' => 'datetime',
    ];
    
    /**
     * Get the user that owns the virtual card.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the transactions for this virtual card.
     */
    public function transactions()
    {
        return $this->hasMany(VirtualCardTransaction::class);
    }
    
    /**
     * Generate a unique card number for this card.
     * Format: 10 digits starting with 25 followed by 8 random digits
     */
    public function generateCardNumber()
    {
        $prefix = '25';
        $randomDigits = str_pad(rand(0, 99999999), 8, '0', STR_PAD_LEFT);
        $cardNumber = $prefix . $randomDigits;
        
        // Ensure it's unique
        while (self::where('card_number', $cardNumber)->exists()) {
            $randomDigits = str_pad(rand(0, 99999999), 8, '0', STR_PAD_LEFT);
            $cardNumber = $prefix . $randomDigits;
        }
        
        $this->card_number = $cardNumber;
        
        // Set expiry date to 1 year from now
        $this->expiry_date = now()->addYear();
        
        return $cardNumber;
    }
    
    /**
     * Process a payment for this card
     * 
     * @param float $amount Amount to add to the card
     * @param string $paymentMethod Payment method used
     * @return array Transaction details
     * @throws \Exception If payment processing fails
     */
    public function processPayment($amount, $paymentMethod)
    {
        // Validate inputs
        if (!is_numeric($amount) || $amount <= 0) {
            throw new \Exception('Invalid payment amount. Amount must be greater than zero.');
        }
        
        if (empty($paymentMethod)) {
            throw new \Exception('Payment method must be specified.');
        }
        
        // First activation requires hold balance to be set
        $isFirstPayment = !$this->is_active;
        
        // Generate transaction ID
        $transactionId = 'TXN-' . time() . '-' . rand(1000, 9999);
        
        // Create the transaction record
        $transaction = $this->transactions()->create([
            'type' => 'PAYMENT',
            'amount' => $amount,
            'payment_method' => $paymentMethod,
            'transaction_id' => $transactionId,
            'status' => 'completed',
            'description' => 'Card recharge via ' . ucfirst($paymentMethod),
        ]);
        
        // Update card balance
        if ($isFirstPayment) {
            // First payment: set hold balance to 200
            $this->hold_balance = 200.00;
            $this->balance = $amount - 200.00;
            $this->is_active = true;
            
            // Generate card number if not already set
            if (!$this->card_number) {
                $this->generateCardNumber();
            }
        } else {
            // Regular recharge: add full amount to balance
            $this->balance += $amount;
        }
        
        // Update payment details
        $this->last_payment_method = $paymentMethod;
        $this->last_transaction_id = $transactionId;
        $this->last_paid_at = now();
        $this->save();
        
        return [
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'hold_balance' => $this->hold_balance,
            'available_balance' => $this->balance,
            'card_number' => $this->card_number,
        ];
    }
    
    /**
     * Record a trip transaction
     * 
     * @param float $amount Amount for the trip
     * @param string $fromStation Starting station
     * @param string $toStation Destination station
     * @return array Transaction details or false if insufficient balance
     */
    public function recordTrip($amount, $fromStation, $toStation)
    {
        // Check if balance is sufficient
        if ($this->balance < $amount) {
            return [
                'success' => false,
                'message' => 'Insufficient balance',
                'remaining_balance' => $this->balance
            ];
        }
        
        // Generate transaction ID
        $transactionId = 'TRIP-' . time() . '-' . rand(1000, 9999);
        
        // Create the transaction record
        $transaction = $this->transactions()->create([
            'type' => 'TRIP',
            'amount' => $amount,
            'transaction_id' => $transactionId,
            'status' => 'completed',
            'description' => 'Trip from ' . $fromStation . ' to ' . $toStation,
            'from_station' => $fromStation,
            'to_station' => $toStation,
        ]);
        
        // Deduct from balance
        $this->balance -= $amount;
        $this->last_used_at = now();
        $this->save();
        
        return [
            'transaction_id' => $transactionId,
            'amount' => $amount,
            'remaining_balance' => $this->balance,
            'from_station' => $fromStation,
            'to_station' => $toStation,
        ];
    }
}