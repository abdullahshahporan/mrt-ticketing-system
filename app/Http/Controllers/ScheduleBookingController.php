<?php

namespace App\Http\Controllers;

use App\Models\ScheduleBooking;
use App\Services\FareService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ScheduleBookingController extends Controller
{
    public function createBooking(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'from_station' => 'required|string',
                'to_station' => 'required|string',
                'quantity' => 'required|integer|min:1|max:10',
                'total_fare' => 'required|numeric|min:0',
                'contact_number' => 'required|string',
                'travel_date' => 'required|date',
                'travel_time' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid booking data',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Generate unique base PNR (MRT format)
            $basePnr = ScheduleBooking::generateBasePNR();

            // Calculate fare per ticket
            $baseFare = floatval($request->total_fare) / intval($request->quantity);
            
            // Set booking time and validity
            $bookingTime = Carbon::now();
            $travelDate = Carbon::parse($request->travel_date);
            $validFrom = Carbon::parse($travelDate->format('Y-m-d') . ' ' . $request->travel_time);
            $validUntil = $validFrom->copy()->addHour();

            // Create individual ticket records for each quantity
            $tickets = [];
            $bookingIds = [];
            
            for ($i = 1; $i <= $request->quantity; $i++) {
                // Generate full PNR with ticket number (MRT123456789-1, MRT123456789-2, etc.)
                $fullPnr = $request->quantity > 1 ? $basePnr . '-' . $i : $basePnr;
                
                // Create individual ticket record
                $booking = ScheduleBooking::create([
                    'pnr' => $fullPnr,
                    'base_pnr' => $basePnr,
                    'ticket_number' => $i,
                    'from_station' => $request->from_station,
                    'to_station' => $request->to_station,
                    'quantity' => 1, // Each record is for 1 ticket
                    'base_fare' => $baseFare,
                    'total_fare' => $baseFare, // Individual ticket fare
                    'contact_number' => $request->contact_number,
                    'travel_date' => $request->travel_date,
                    'time_slot' => $request->travel_time . ' - ' . $validUntil->format('H:i'),
                    'valid_from' => $validFrom,
                    'valid_until' => $validUntil,
                    'status' => 'scheduled',
                    'booking_time' => $bookingTime
                ]);
                
                $tickets[] = $fullPnr;
                $bookingIds[] = $booking->id;
            }

            Log::info('Schedule booking created', [
                'base_pnr' => $basePnr,
                'tickets' => $tickets,
                'quantity' => $request->quantity
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'base_pnr' => $basePnr,
                'pnr' => $basePnr,
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
                    'contact_number' => $request->contact_number,
                    'travel_date' => $request->travel_date,
                    'travel_time' => $request->travel_time,
                    'booking_time' => $bookingTime->toDateTimeString(),
                    'valid_from' => $validFrom->toDateTimeString(),
                    'valid_until' => $validUntil->toDateTimeString(),
                    'status' => 'scheduled'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Schedule booking creation error', [
                'error' => $e->getMessage(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Booking creation failed. Please try again.'
            ], 500);
        }
    }

    public function getStations(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'stations' => FareService::getStations()
        ]);
    }

    public function calculateFare(Request $request): JsonResponse
    {
        try {
            $fareData = FareService::calculateFare(
                $request->from_station,
                $request->to_station,
                $request->quantity
            );

            return response()->json([
                'success' => true,
                'base_fare' => $fareData['base_fare'],
                'total_fare' => $fareData['total_fare'],
                'quantity' => $request->quantity
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Fare calculation failed'
            ], 500);
        }
    }

    public function getOperatingHours(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'operating_hours' => [
                'earliest_start' => '07:00',
                'latest_start' => '22:00',
                'validity_duration' => 1
            ]
        ]);
    }

    public function getBookingStatistics(): JsonResponse
    {
        try {
            $today = Carbon::today();
            
            $stats = [
                'today' => [
                    'total_bookings' => ScheduleBooking::whereDate('booking_time', $today)->count(),
                    'total_revenue' => ScheduleBooking::whereDate('booking_time', $today)->sum('total_fare'),
                ],
                'total' => [
                    'total_bookings' => ScheduleBooking::count(),
                    'total_revenue' => ScheduleBooking::sum('total_fare'),
                ]
            ];

            return response()->json([
                'success' => true,
                'statistics' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics'
            ], 500);
        }
    }

    public function getBookingByPNR(string $pnr): JsonResponse
    {
        try {
            $tickets = ScheduleBooking::where('base_pnr', $pnr)
                                     ->orderBy('ticket_number')
                                     ->get();

            if ($tickets->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No booking found with this PNR'
                ], 404);
            }

            $firstTicket = $tickets->first();

            return response()->json([
                'success' => true,
                'booking' => [
                    'base_pnr' => $pnr,
                    'from_station' => $firstTicket->from_station,
                    'to_station' => $firstTicket->to_station,
                    'total_tickets' => $tickets->count(),
                    'contact_number' => $firstTicket->contact_number,
                    'travel_date' => $firstTicket->travel_date,
                    'time_slot' => $firstTicket->time_slot,
                    'status' => $firstTicket->status,
                    'total_fare' => $tickets->sum('total_fare')
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('PNR lookup error', [
                'pnr' => $pnr,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error looking up booking'
            ], 500);
        }
    }

    public function checkBookingStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pnr' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'PNR is required'
            ], 422);
        }

        return $this->getBookingByPNR($request->pnr);
    }
}
