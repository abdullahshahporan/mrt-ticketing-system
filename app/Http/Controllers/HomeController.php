<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    /**
     * Display the main application page
     */
    public function index(): View
    {
        // Data for the main application
        $appData = [
            'title' => 'MRT Ticketing System',
            'description' => 'Your convenient and efficient way to travel across the metro rail network.',
            'version' => '1.0.0',
            'current_year' => date('Y'),
        ];

        return view('app', compact('appData'));
    }

    /**
     * Get header configuration data
     */
    public function getHeaderData(): JsonResponse
    {
        $headerData = [
            'logo' => [
                'text' => 'MRT Ticketing System',
                'show_logo' => true,
            ],
            'navigation' => [
                'sign_in' => [
                    'text' => 'Sign In',
                    'url' => '/login',
                    'variant' => 'outline'
                ],
                'get_started' => [
                    'text' => 'Get Started',
                    'url' => '/register',
                    'variant' => 'default'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $headerData
        ]);
    }

    /**
     * Get footer configuration data
     */
    public function getFooterData(): JsonResponse
    {
        $footerData = [
            'company' => [
                'name' => 'MRT Ticketing System',
                'description' => 'Your convenient and efficient way to travel across the metro rail network. Book tickets, plan your journey, and enjoy seamless travel experience.',
            ],
            'quick_links' => [
                ['name' => 'Book Tickets', 'url' => '/book'],
                ['name' => 'Route Map', 'url' => '/routes'],
                ['name' => 'Schedules', 'url' => '/schedules'],
                ['name' => 'Fare Calculator', 'url' => '/calculator'],
            ],
            'support' => [
                ['name' => 'Help Center', 'url' => '/help'],
                ['name' => 'Contact Us', 'url' => '/contact'],
                ['name' => 'Terms of Service', 'url' => '/terms'],
                ['name' => 'Privacy Policy', 'url' => '/privacy'],
            ],
            'social_media' => [
                ['name' => 'Facebook', 'url' => '#', 'icon' => 'facebook'],
                ['name' => 'Twitter', 'url' => '#', 'icon' => 'twitter'],
                ['name' => 'LinkedIn', 'url' => '#', 'icon' => 'linkedin'],
            ],
            'copyright' => '© ' . date('Y') . ' MRT Ticketing System. All rights reserved.'
        ];

        return response()->json([
            'success' => true,
            'data' => $footerData
        ]);
    }

    /**
     * Get complete app configuration
     */
    public function getAppConfig(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'app_name' => 'MRT Ticketing System',
                'version' => '1.0.0',
                'features' => [
                    'booking' => true,
                    'route_planning' => true,
                    'payments' => true,
                    'real_time_tracking' => true,
                ],
                'theme' => [
                    'primary_color' => '#059669', // Green
                    'secondary_color' => '#DC2626', // Red
                    'background' => '#F9FAFB', // Light gray
                ]
            ]
        ]);
    }
}
