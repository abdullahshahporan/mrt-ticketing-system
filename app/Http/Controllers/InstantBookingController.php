<?php

namespace App\Http\Controllers;

use App\Models\InstantBooking;
use App\Services\FareService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InstantBookingController extends Controller
{
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

            // Get fare using FareService
            $fareData = FareService::calculateFare($fromStation, $toStation, $quantity);

            Log::info('Fare calculated', [
                'from' => $fromStation,
                'to' => $toStation,
                'quantity' => $quantity,
                'base_fare' => $fareData['base_fare'],
                'total_fare' => $fareData['total_fare']
            ]);

            return response()->json([
                'success' => true,
                'base_fare' => $fareData['base_fare'],
                'total_fare' => $fareData['total_fare'],
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

            // Calculate base fare using FareService
            $baseFare = FareService::getFare($request->from_station, $request->to_station);
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
     * Get all stations
     */
    public function getStations(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'stations' => FareService::getStations()
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