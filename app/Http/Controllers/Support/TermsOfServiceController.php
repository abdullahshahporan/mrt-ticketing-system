<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TermsOfServiceController extends Controller
{
    /**
     * Get basic terms information
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'terms' => [
                    'Service Usage' => 'By using our system, you agree to these terms.',
                    'Booking Terms' => 'All bookings are subject to availability.',
                    'Payment' => 'Payments are processed securely.',
                    'User Responsibilities' => 'Provide accurate information and follow metro rules.'
                ]
            ]
        ]);
    }
}