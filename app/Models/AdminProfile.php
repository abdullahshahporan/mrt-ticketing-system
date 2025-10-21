<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminProfile extends Model
{
    use HasFactory;

    protected $table = 'admin_profile';

    protected $fillable = [
        'name',
        'email',
        'contact_no',
        'nid_no',
        'date_of_birth',
        'address',
    ];
}
