<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HelpCenterController extends Controller
{
    /**
     * Get basic help information
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'faqs' => [
                    'How do I book a ticket?' => 'Select stations, choose time, proceed with payment.',
                    'What payment methods are accepted?' => 'bKash, Nagad, Rocket, credit/debit cards.',
                    'Can I cancel my booking?' => 'Yes, up to 30 minutes before departure.'
                ],
                'contact' => '09666778899'
            ]
        ]);
    }
}
