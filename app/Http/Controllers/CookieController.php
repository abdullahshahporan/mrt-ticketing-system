<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CookieController extends Controller
{
    /**
     * Get cookie policy information
     */
    public function getPolicy(): JsonResponse
    {
        $policy = [
            'title' => 'Cookie Policy - MRT Ticketing System',
            'last_updated' => '2025-09-30',
            'sections' => [
                [
                    'title' => 'What are cookies?',
                    'content' => 'Cookies are small text files that are placed on your device when you visit our MRT Ticketing System website.'
                ],
                [
                    'title' => 'How we use cookies',
                    'content' => 'We use cookies to enhance your experience, remember your preferences, and analyze site traffic to improve our services.'
                ],
                [
                    'title' => 'Types of cookies we use',
                    'content' => 'We use necessary cookies for site functionality, analytics cookies to understand usage, and preference cookies to remember your settings.'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $policy
        ]);
    }

    /**
     * Log cookie consent (optional - for analytics)
     */
    public function logConsent(Request $request): JsonResponse
    {
        $consent = $request->validate([
            'consent_type' => 'required|in:accepted,declined',
            'preferences' => 'nullable|array'
        ]);

        // Log consent (you can store in database if needed)
        Log::info('Cookie consent logged', [
            'consent_type' => $consent['consent_type'],
            'preferences' => $consent['preferences'] ?? [],
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'timestamp' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Consent logged successfully'
        ]);
    }

    /**
     * Get cookie settings
     */
    public function getSettings(): JsonResponse
    {
        $settings = [
            'banner_text' => 'We use cookies to enhance your experience on our MRT Ticketing System.',
            'policy_url' => '/privacy-policy',
            'expire_days' => 30,
            'cookie_types' => [
                'necessary' => [
                    'name' => 'Necessary',
                    'description' => 'Required for basic site functionality',
                    'required' => true
                ],
                'analytics' => [
                    'name' => 'Analytics',
                    'description' => 'Help us understand how you use our site',
                    'required' => false
                ],
                'preferences' => [
                    'name' => 'Preferences',
                    'description' => 'Remember your settings and preferences',
                    'required' => false
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }
}