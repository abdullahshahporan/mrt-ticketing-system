<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\VirtualCard;

class VirtualCardInfo extends Controller
{
    // GET /api/admin/virtual-cards
    public function getAllCards()
    {
        $cards = VirtualCard::select([
            'id',
            'card_number',
            'name',
            'nid_no',
            'contact_no',
            'balance'
        ])->get();
        return response()->json($cards);
    }
}
