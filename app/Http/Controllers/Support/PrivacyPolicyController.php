<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PrivacyPolicyController extends Controller
{
    /**
     * Get basic privacy information
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'privacy' => [
                    'Information We Collect' => 'Name, email, phone number, and payment information.',
                    'How We Use Information' => 'To process bookings and provide customer support.',
                    'Data Security' => 'We protect your information with appropriate security measures.',
                    'Your Rights' => 'You can access, update, or delete your personal information.'
                ],
                'contact' => 'privacy@mrtticket.gov.bd'
            ]
        ]);
    }
}