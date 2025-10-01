<?php

namespace App\Http\Controllers;

use App\Models\InstantBooking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InstantBookingController extends Controller
{
    /**
     * Station fare matrix based on the provided fare chart
     */
    private $fareMatrix = [
        'uttara_north' => [
            'uttara_center' => 20, 'uttara_south' => 20, 'pallabi' => 30,
            'mirpur_11' => 30, 'mirpur_10' => 40, 'kazipara' => 40,
            'shewrapara' => 50, 'agargaon' => 60, 'bijoy_sarani' => 60,
            'farmgate' => 70, 'karwan_bazar' => 80, 'shahbag' => 80,
            'dhaka_university' => 90, 'bangladesh_secretariat' => 90,
            'motijheel' => 100
        ],
        'uttara_center' => [
            'uttara_north' => 20, 'uttara_south' => 20, 'pallabi' => 20,
            'mirpur_11' => 30, 'mirpur_10' => 30, 'kazipara' => 40,
            'shewrapara' => 40, 'agargaon' => 50, 'bijoy_sarani' => 60,
            'farmgate' => 60, 'karwan_bazar' => 70, 'shahbag' => 80,
            'dhaka_university' => 80, 'bangladesh_secretariat' => 90,
            'motijheel' => 100
        ],
        'uttara_south' => [
            'uttara_north' => 20, 'uttara_center' => 20, 'pallabi' => 20,
            'mirpur_11' => 20, 'mirpur_10' => 30, 'kazipara' => 30,
            'shewrapara' => 40, 'agargaon' => 40, 'bijoy_sarani' => 50,
            'farmgate' => 60, 'karwan_bazar' => 60, 'shahbag' => 70,
            'dhaka_university' => 80, 'bangladesh_secretariat' => 80,
            'motijheel' => 90
        ],
        'pallabi' => [
            'uttara_north' => 30, 'uttara_center' => 20, 'uttara_south' => 20,
            'mirpur_11' => 20, 'mirpur_10' => 20, 'kazipara' => 20,
            'shewrapara' => 30, 'agargaon' => 30, 'bijoy_sarani' => 40,
            'farmgate' => 50, 'karwan_bazar' => 50, 'shahbag' => 60,
            'dhaka_university' => 60, 'bangladesh_secretariat' => 70,
            'motijheel' => 80
        ],
        'mirpur_11' => [
            'uttara_north' => 30, 'uttara_center' => 30, 'uttara_south' => 20,
            'pallabi' => 20, 'mirpur_10' => 20, 'kazipara' => 20,
            'shewrapara' => 20, 'agargaon' => 30, 'bijoy_sarani' => 40,
            'farmgate' => 40, 'karwan_bazar' => 50, 'shahbag' => 60,
            'dhaka_university' => 60, 'bangladesh_secretariat' => 70,
            'motijheel' => 70
        ],
        'mirpur_10' => [
            'uttara_north' => 40, 'uttara_center' => 30, 'uttara_south' => 30,
            'pallabi' => 20, 'mirpur_11' => 20, 'kazipara' => 20,
            'shewrapara' => 20, 'agargaon' => 20, 'bijoy_sarani' => 30,
            'farmgate' => 30, 'karwan_bazar' => 40, 'shahbag' => 50,
            'dhaka_university' => 50, 'bangladesh_secretariat' => 60,
            'motijheel' => 60
        ],
        'kazipara' => [
            'uttara_north' => 40, 'uttara_center' => 40, 'uttara_south' => 30,
            'pallabi' => 20, 'mirpur_11' => 20, 'mirpur_10' => 20,
            'shewrapara' => 20, 'agargaon' => 20, 'bijoy_sarani' => 20,
            'farmgate' => 30, 'karwan_bazar' => 30, 'shahbag' => 40,
            'dhaka_university' => 50, 'bangladesh_secretariat' => 50,
            'motijheel' => 60
        ],
        'shewrapara' => [
            'uttara_north' => 50, 'uttara_center' => 40, 'uttara_south' => 40,
            'pallabi' => 30, 'mirpur_11' => 20, 'mirpur_10' => 20,
            'kazipara' => 20, 'agargaon' => 20, 'bijoy_sarani' => 20,
            'farmgate' => 20, 'karwan_bazar' => 30, 'shahbag' => 40,
            'dhaka_university' => 40, 'bangladesh_secretariat' => 50,
            'motijheel' => 50
        ],
        'agargaon' => [
            'uttara_north' => 60, 'uttara_center' => 50, 'uttara_south' => 40,
            'pallabi' => 30, 'mirpur_11' => 30, 'mirpur_10' => 20,
            'kazipara' => 20, 'shewrapara' => 20, 'bijoy_sarani' => 20,
            'farmgate' => 20, 'karwan_bazar' => 20, 'shahbag' => 30,
            'dhaka_university' => 40, 'bangladesh_secretariat' => 40,
            'motijheel' => 50
        ],
        'bijoy_sarani' => [
            'uttara_north' => 60, 'uttara_center' => 60, 'uttara_south' => 50,
            'pallabi' => 40, 'mirpur_11' => 40, 'mirpur_10' => 30,
            'kazipara' => 20, 'shewrapara' => 20, 'agargaon' => 20,
            'farmgate' => 20, 'karwan_bazar' => 20, 'shahbag' => 20,
            'dhaka_university' => 30, 'bangladesh_secretariat' => 30,
            'motijheel' => 40
        ],
        'farmgate' => [
            'uttara_north' => 70, 'uttara_center' => 60, 'uttara_south' => 60,
            'pallabi' => 50, 'mirpur_11' => 40, 'mirpur_10' => 30,
            'kazipara' => 30, 'shewrapara' => 20, 'agargaon' => 20,
            'bijoy_sarani' => 20, 'karwan_bazar' => 20, 'shahbag' => 20,
            'dhaka_university' => 20, 'bangladesh_secretariat' => 30,
            'motijheel' => 30
        ],
        'karwan_bazar' => [
            'uttara_north' => 80, 'uttara_center' => 70, 'uttara_south' => 60,
            'pallabi' => 50, 'mirpur_11' => 50, 'mirpur_10' => 40,
            'kazipara' => 30, 'shewrapara' => 30, 'agargaon' => 20,
            'bijoy_sarani' => 20, 'farmgate' => 20, 'shahbag' => 20,
            'dhaka_university' => 20, 'bangladesh_secretariat' => 20,
            'motijheel' => 30
        ],
        'shahbag' => [
            'uttara_north' => 80, 'uttara_center' => 80, 'uttara_south' => 70,
            'pallabi' => 60, 'mirpur_11' => 60, 'mirpur_10' => 50,
            'kazipara' => 40, 'shewrapara' => 40, 'agargaon' => 30,
            'bijoy_sarani' => 20, 'farmgate' => 20, 'karwan_bazar' => 20,
            'dhaka_university' => 20, 'bangladesh_secretariat' => 20,
            'motijheel' => 20
        ],
        'dhaka_university' => [
            'uttara_north' => 90, 'uttara_center' => 80, 'uttara_south' => 80,
            'pallabi' => 60, 'mirpur_11' => 60, 'mirpur_10' => 50,
            'kazipara' => 50, 'shewrapara' => 40, 'agargaon' => 40,
            'bijoy_sarani' => 30, 'farmgate' => 20, 'karwan_bazar' => 20,
            'shahbag' => 20, 'bangladesh_secretariat' => 20,
            'motijheel' => 20
        ],
        'bangladesh_secretariat' => [
            'uttara_north' => 90, 'uttara_center' => 90, 'uttara_south' => 80,
            'pallabi' => 70, 'mirpur_11' => 70, 'mirpur_10' => 60,
            'kazipara' => 50, 'shewrapara' => 50, 'agargaon' => 40,
            'bijoy_sarani' => 30, 'farmgate' => 30, 'karwan_bazar' => 20,
            'shahbag' => 20, 'dhaka_university' => 20, 'motijheel' => 20
        ],
        'motijheel' => [
            'uttara_north' => 100, 'uttara_center' => 100, 'uttara_south' => 90,
            'pallabi' => 80, 'mirpur_11' => 70, 'mirpur_10' => 60,
            'kazipara' => 60, 'shewrapara' => 50, 'agargaon' => 50,
            'bijoy_sarani' => 40, 'farmgate' => 30, 'karwan_bazar' => 30,
            'shahbag' => 20, 'dhaka_university' => 20,
            'bangladesh_secretariat' => 20
        ]
    ];

    /**
     * Calculate fare for instant booking
     */
    public function calculateFare(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'from_station' => 'required|string',
                'to_station' => 'required|string|different:from_station',
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid input',
                    'errors' => $validator->errors()
                ], 422);
            }

            $fromStation = $request->from_station;
            $toStation = $request->to_station;
            $quantity = $request->quantity;

            // Get fare from matrix
            $baseFare = $this->getFare($fromStation, $toStation);
            $totalFare = $baseFare * $quantity;

            Log::info('Fare calculated', [
                'from' => $fromStation,
                'to' => $toStation,
                'quantity' => $quantity,
                'base_fare' => $baseFare,
                'total_fare' => $totalFare
            ]);

            return response()->json([
                'success' => true,
                'base_fare' => $baseFare,
                'total_fare' => $totalFare,
                'quantity' => $quantity
            ]);

        } catch (\Exception $e) {
            Log::error('Fare calculation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Fare calculation failed'
            ], 500);
        }
    }

    /**
     * Create instant booking
     */
    public function createBooking(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'from_station' => 'required|string',
                'to_station' => 'required|string|different:from_station',
                'quantity' => 'required|integer|min:1|max:10',
                'total_fare' => 'required|numeric|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid booking data',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Calculate base fare
            $baseFare = $this->getFare($request->from_station, $request->to_station);
            $calculatedTotal = $baseFare * $request->quantity;

            // Verify fare matches
            if (abs($calculatedTotal - $request->total_fare) > 0.01) {
                return response()->json([
                    'success' => false,
                    'message' => 'Fare mismatch detected'
                ], 400);
            }

            // Generate unique base PNR
            $basePnr = InstantBooking::generateBasePNR();

            // Set booking and expiry time
            $bookingTime = Carbon::now();
            $validUntil = $bookingTime->copy()->addHour();

            // Create individual ticket records for each quantity
            $tickets = [];
            $bookingIds = [];
            
            for ($i = 1; $i <= $request->quantity; $i++) {
                // Generate full PNR with ticket number
                $fullPnr = InstantBooking::generateFullPNR($basePnr, $i);
                
                // Create individual ticket record
                $booking = InstantBooking::create([
                    'pnr' => $fullPnr,
                    'base_pnr' => $basePnr,
                    'ticket_number' => $i,
                    'from_station' => $request->from_station,
                    'to_station' => $request->to_station,
                    'quantity' => 1, // Each record is for 1 ticket
                    'base_fare' => $baseFare,
                    'total_fare' => $baseFare, // Individual ticket fare
                    'status' => 'active',
                    'booking_time' => $bookingTime,
                    'valid_until' => $validUntil,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ]);
                
                $tickets[] = $fullPnr;
                $bookingIds[] = $booking->id;
            }

            Log::info('Instant booking created with individual tickets', [
                'booking_ids' => $bookingIds,
                'base_pnr' => $basePnr,
                'tickets' => $tickets,
                'from' => $request->from_station,
                'to' => $request->to_station,
                'quantity' => $request->quantity,
                'total_fare' => $request->total_fare,
                'valid_until' => $validUntil->toDateTimeString()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'base_pnr' => $basePnr,
                'pnr' => $basePnr, // For backward compatibility
                'tickets' => $tickets,
                'booking_ids' => $bookingIds,
                'booking_details' => [
                    'base_pnr' => $basePnr,
                    'tickets' => $tickets,
                    'ticket_count' => count($tickets),
                    'from' => $request->from_station,
                    'to' => $request->to_station,
                    'quantity' => $request->quantity,
                    'base_fare' => $baseFare,
                    'total_fare' => $request->total_fare,
                    'booking_time' => $bookingTime->toDateTimeString(),
                    'valid_until' => $validUntil->toDateTimeString(),
                    'validity_hours' => 1,
                    'remaining_minutes' => 60,
                    'status' => 'active'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Instant booking creation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Booking creation failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Get fare from matrix
     */
    private function getFare(string $from, string $to): int
    {
        if (isset($this->fareMatrix[$from][$to])) {
            return $this->fareMatrix[$from][$to];
        }

        // Default fare if not in matrix
        return 20;
    }

    /**
     * Get all stations
     */
    public function getStations(): JsonResponse
    {
        $stations = [
            ['id' => 'uttara_north', 'name' => 'Uttara North', 'order' => 1],
            ['id' => 'uttara_center', 'name' => 'Uttara Center', 'order' => 2],
            ['id' => 'uttara_south', 'name' => 'Uttara South', 'order' => 3],
            ['id' => 'pallabi', 'name' => 'Pallabi', 'order' => 4],
            ['id' => 'mirpur_11', 'name' => 'Mirpur 11', 'order' => 5],
            ['id' => 'mirpur_10', 'name' => 'Mirpur 10', 'order' => 6],
            ['id' => 'kazipara', 'name' => 'Kazipara', 'order' => 7],
            ['id' => 'shewrapara', 'name' => 'Shewrapara', 'order' => 8],
            ['id' => 'agargaon', 'name' => 'Agargaon', 'order' => 9],
            ['id' => 'bijoy_sarani', 'name' => 'Bijoy Sarani', 'order' => 10],
            ['id' => 'farmgate', 'name' => 'Farmgate', 'order' => 11],
            ['id' => 'karwan_bazar', 'name' => 'Karwan Bazar', 'order' => 12],
            ['id' => 'shahbag', 'name' => 'Shahbag', 'order' => 13],
            ['id' => 'dhaka_university', 'name' => 'Dhaka University', 'order' => 14],
            ['id' => 'bangladesh_secretariat', 'name' => 'Bangladesh Secretariat', 'order' => 15],
            ['id' => 'motijheel', 'name' => 'Motijheel', 'order' => 16]
        ];

        return response()->json([
            'success' => true,
            'stations' => $stations
        ]);
    }

    /**
     * Check booking status by PNR
     */
    public function checkBookingStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'pnr' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'PNR is required'
                ], 422);
            }

            $booking = InstantBooking::where('pnr', $request->pnr)->first();

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }

            // Auto-expire if time passed
            if ($booking->status === 'active' && $booking->isExpired()) {
                $booking->markAsExpired();
            }

            return response()->json([
                'success' => true,
                'booking' => [
                    'pnr' => $booking->pnr,
                    'from' => $booking->from_station_name,
                    'to' => $booking->to_station_name,
                    'quantity' => $booking->quantity,
                    'total_fare' => $booking->total_fare,
                    'status' => $booking->status,
                    'booking_time' => $booking->booking_time->toDateTimeString(),
                    'valid_until' => $booking->valid_until->toDateTimeString(),
                    'remaining_minutes' => $booking->getRemainingMinutes(),
                    'is_valid' => $booking->isValid(),
                    'is_expired' => $booking->isExpired(),
                    'used_at' => $booking->used_at?->toDateTimeString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Booking status check error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check booking status'
            ], 500);
        }
    }

    /**
     * Expire old bookings (can be run via scheduler)
     */
    public function expireOldBookings(): JsonResponse
    {
        try {
            $expiredCount = InstantBooking::expired()
                ->update(['status' => 'expired']);

            Log::info('Expired old bookings', [
                'count' => $expiredCount,
                'timestamp' => Carbon::now()
            ]);

            return response()->json([
                'success' => true,
                'message' => "Expired {$expiredCount} bookings",
                'expired_count' => $expiredCount
            ]);

        } catch (\Exception $e) {
            Log::error('Expire bookings error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to expire bookings'
            ], 500);
        }
    }

    /**
     * Get booking statistics
     */
    public function getBookingStatistics(): JsonResponse
    {
        try {
            $today = Carbon::today();

            $stats = [
                'today' => [
                    'total_bookings' => InstantBooking::whereDate('booking_time', $today)->count(),
                    'active_bookings' => InstantBooking::active()->whereDate('booking_time', $today)->count(),
                    'expired_bookings' => InstantBooking::where('status', 'expired')->whereDate('booking_time', $today)->count(),
                    'used_bookings' => InstantBooking::where('status', 'used')->whereDate('booking_time', $today)->count(),
                    'total_revenue' => InstantBooking::whereDate('booking_time', $today)->sum('total_fare'),
                    'total_tickets' => InstantBooking::whereDate('booking_time', $today)->sum('quantity')
                ],
                'all_time' => [
                    'total_bookings' => InstantBooking::count(),
                    'total_revenue' => InstantBooking::sum('total_fare'),
                    'total_tickets' => InstantBooking::sum('quantity')
                ]
            ];

            return response()->json([
                'success' => true,
                'statistics' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Statistics retrieval error', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics'
            ], 500);
        }
    }

    /**
     * Get booking details by PNR (base PNR or full PNR)
     */
    public function getBookingByPNR(string $pnr): JsonResponse
    {
        try {
            // Validate PNR format (base PNR without ticket number)
            if (!preg_match('/^MRT\d{9}$/', $pnr)) {
                return response()->json([
                    'success' => false,
                    'valid' => false,
                    'message' => 'Invalid PNR format. PNR must start with MRT followed by 9 digits.'
                ], 400);
            }

            // Find all tickets by base PNR
            $tickets = InstantBooking::where('base_pnr', $pnr)
                                    ->orderBy('ticket_number')
                                    ->get();

            if ($tickets->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'valid' => false,
                    'message' => 'No booking found with this PNR number.'
                ], 404);
            }

            // Update expired tickets
            foreach ($tickets as $ticket) {
                if ($ticket->isExpired() && $ticket->status === 'active') {
                    $ticket->status = 'expired';
                    $ticket->save();
                }
            }

            // Get booking summary from first ticket
            $firstTicket = $tickets->first();
            
            // Calculate minutes remaining
            $minutesRemaining = null;
            if (!$firstTicket->isExpired() && $firstTicket->status === 'active') {
                $now = Carbon::now();
                $validUntil = Carbon::parse($firstTicket->valid_until);
                $minutesRemaining = max(0, (int) $now->diffInMinutes($validUntil, false));
            }

            // Count tickets by status
            $activeCount = $tickets->where('status', 'active')->count();
            $usedCount = $tickets->where('status', 'used')->count();
            $expiredCount = $tickets->where('status', 'expired')->count();
            $totalFare = $tickets->sum('total_fare');

            // Format ticket list
            $ticketList = $tickets->map(function($ticket) use ($minutesRemaining) {
                return [
                    'pnr' => $ticket->pnr,
                    'ticket_number' => $ticket->ticket_number,
                    'status' => $ticket->status,
                    'base_fare' => $ticket->base_fare,
                    'is_expired' => $ticket->isExpired(),
                    'used_at' => $ticket->used_at?->format('Y-m-d H:i:s'),
                    'minutes_remaining' => ($ticket->status === 'active' && !$ticket->isExpired()) ? $minutesRemaining : 0
                ];
            });

            return response()->json([
                'success' => true,
                'valid' => true,
                'booking' => [
                    'base_pnr' => $pnr,
                    'from_station' => $firstTicket->from_station,
                    'to_station' => $firstTicket->to_station,
                    'total_tickets' => $tickets->count(),
                    'active_tickets' => $activeCount,
                    'used_tickets' => $usedCount,
                    'expired_tickets' => $expiredCount,
                    'base_fare' => $firstTicket->base_fare,
                    'total_fare' => $totalFare,
                    'booking_time' => $firstTicket->booking_time->format('Y-m-d H:i:s'),
                    'valid_until' => $firstTicket->valid_until->format('Y-m-d H:i:s'),
                    'is_expired' => $firstTicket->isExpired(),
                    'minutes_remaining' => $minutesRemaining,
                    'tickets' => $ticketList
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('PNR lookup error', [
                'pnr' => $pnr,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'valid' => false,
                'message' => 'An error occurred while verifying the ticket. Please try again.'
            ], 500);
        }
    }
}