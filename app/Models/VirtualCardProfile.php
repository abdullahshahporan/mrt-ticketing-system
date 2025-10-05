<?php

namespace App\Models;

use App\Models\VirtualCardPayment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VirtualCardProfile extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'contact_no',
        'nid_no',
        'date_of_birth',
        'is_active',
        'card_number',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'is_active' => 'boolean',
    ];
    
    /**
     * Get the payments for the profile.
     */
    public function payments()
    {
        return $this->hasMany(VirtualCardPayment::class, 'profile_id');
    }
    
    /**
     * Generate a unique card number for this profile.
     */
    public function generateCardNumber()
    {
        $prefix = '2025';
        $randomDigits = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->card_number = $prefix . $randomDigits;
        $this->save();
        
        return $this->card_number;
    }
}
