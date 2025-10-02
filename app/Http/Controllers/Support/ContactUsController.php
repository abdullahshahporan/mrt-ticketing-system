<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactUsController extends Controller
{
    /**
     * Get basic contact information
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'phone' => '09666778899',
                'emergency' => '16263',
                'email' => 'support@mrtticket.gov.bd'
            ]
        ]);
    }
}