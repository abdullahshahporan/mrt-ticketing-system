<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class OneTimeTicketController extends Controller
{
    /**
     * Get booking options for one time tickets
     *
     * @return JsonResponse
     */
    public function getBookingOptions(): JsonResponse
    {
        return response()->json([
            'options' => [
                'instant' => [
                    'title' => 'Instant Booking',
                    'description' => 'Travel now or within 1 hours',
                    'features' => [
                        'Immediate ticket generation',
                        'Real-time seat availability',
                        'Fast payment processing',
                        'Mobile QR code ready'
                    ],
                    'validity' => '1 hour',
                    'enabled' => true
                ],
                'scheduled' => [
                    'title' => 'Schedule For Later',
                    'description' => 'Plan your journey in advance',
                    'features' => [
                        'Book up to 30 days ahead',
                        'Choose specific time slots',
                        'Email & SMS reminders',
                        'Flexible cancellation'
                    ],
                    'validity' => '30 days',
                    'enabled' => true
                ]
            ]
        ]);
    }

    /**
     * Initialize instant booking process
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function initializeInstantBooking(Request $request): JsonResponse
    {
        try {
            Log::info('Instant booking initialization', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Instant booking initialized',
                'data' => [
                    'booking_type' => 'instant',
                    'max_validity_hours' => 1,
                    'available_routes' => $this->getAvailableRoutes(),
                    'session_id' => uniqid('instant_', true)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Instant booking initialization error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize instant booking'
            ], 500);
        }
    }

    /**
     * Initialize scheduled booking process
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function initializeScheduledBooking(Request $request): JsonResponse
    {
        try {
            Log::info('Scheduled booking initialization', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'timestamp' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Scheduled booking initialized',
                'data' => [
                    'booking_type' => 'scheduled',
                    'max_advance_days' => 30,
                    'available_routes' => $this->getAvailableRoutes(),
                    'session_id' => uniqid('scheduled_', true)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Scheduled booking initialization error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize scheduled booking'
            ], 500);
        }
    }

    /**
     * Get available MRT routes
     *
     * @return array
     */
    private function getAvailableRoutes(): array
    {
        // TODO: Replace with actual database query
        return [
            [
                'id' => 1,
                'name' => 'Line 6 (Uttara North - Motijheel)',
                'stations' => [
                    'Uttara North', 'Uttara Center', 'Uttara South',
                    'Pallabi', 'Mirpur 11', 'Mirpur 10', 'Kazipara',
                    'Shewrapara', 'Agargaon', 'Bijoy Sarani',
                    'Farmgate', 'Karwan Bazar', 'Shahbag',
                    'Dhaka University', 'Bangladesh Secretariat',
                    'Motijheel'
                ],
                'fare_base' => 20,
                'status' => 'active'
            ]
        ];
    }

    /**
     * Get booking statistics for admin
     *
     * @return JsonResponse
     */
    public function getBookingStats(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'instant_bookings_today' => 245,
                'scheduled_bookings_today' => 89,
                'total_revenue_today' => 6680,
                'popular_routes' => [
                    'Uttara North - Motijheel' => 156,
                    'Farmgate - Dhaka University' => 98,
                    'Shahbag - Bangladesh Secretariat' => 80
                ]
            ]
        ]);
    }
}