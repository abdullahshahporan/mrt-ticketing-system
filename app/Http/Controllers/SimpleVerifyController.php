<?php

namespace App\Http\Controllers;

use App\Models\InstantBooking;
use App\Models\ScheduleBooking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class SimpleVerifyController extends Controller
{
    /**
     * Super simple PNR verification - no middleware, no validation, just check database
     */
    public function verify(Request $request, $pnr = null): JsonResponse
    {
        // Get PNR from request or route parameter
        $pnr = $pnr ?: $request->input('pnr');
        
        if (!$pnr) {
            return response()->json([
                'isValid' => false,
                'message' => 'PNR is required'
            ]);
        }

        // Extract base PNR (remove -1, -2 suffix)
        $basePnr = preg_replace('/(-\d+)$/', '', $pnr);
        
        // Check instant bookings first
        $instantTickets = InstantBooking::where('base_pnr', $basePnr)->get();
        
        if ($instantTickets->count() > 0) {
            $firstTicket = $instantTickets->first();
            return response()->json([
                'success' => true,
                'valid' => true,
                'message' => 'Instant booking verified successfully',
                'booking' => [
                    'base_pnr' => $basePnr,
                    'from_station' => $firstTicket->from_station,
                    'to_station' => $firstTicket->to_station,
                    'mobile_number' => $firstTicket->mobile_number,
                    'total_tickets' => $instantTickets->count(),
                    'total_fare' => $instantTickets->sum('total_fare'),
                    'base_fare' => $firstTicket->base_fare,
                    'valid_until' => $firstTicket->valid_until->format('Y-m-d H:i:s'),
                    'booking_time' => $firstTicket->created_at->format('Y-m-d H:i:s'),
                    'status' => 'Valid',
                    'is_expired' => Carbon::now()->greaterThan($firstTicket->valid_until),
                    'minutes_remaining' => Carbon::now()->lessThan($firstTicket->valid_until) ? 
                        Carbon::now()->diffInMinutes($firstTicket->valid_until) : 0,
                    'tickets' => $instantTickets->map(function($ticket) {
                        return [
                            'pnr' => $ticket->pnr,
                            'ticket_number' => $ticket->ticket_number,
                            'base_fare' => $ticket->base_fare,
                            'status' => $ticket->status,
                            'used_at' => $ticket->used_at
                        ];
                    })->toArray(),
                    'active_tickets' => $instantTickets->where('status', 'active')->count(),
                    'used_tickets' => $instantTickets->where('status', 'used')->count(),
                    'expired_tickets' => $instantTickets->where('status', 'expired')->count()
                ]
            ]);
        }
        
        // Check schedule bookings
        $scheduleTickets = ScheduleBooking::where('base_pnr', $basePnr)->get();
        
        if ($scheduleTickets->count() > 0) {
            $firstTicket = $scheduleTickets->first();
            return response()->json([
                'success' => true,
                'valid' => true,
                'message' => 'Scheduled booking verified successfully',
                'booking' => [
                    'base_pnr' => $basePnr,
                    'from_station' => $firstTicket->from_station,
                    'to_station' => $firstTicket->to_station,
                    'contact_number' => $firstTicket->contact_number,
                    'travel_date' => $firstTicket->travel_date,
                    'time_slot' => $firstTicket->time_slot,
                    'total_tickets' => $scheduleTickets->count(),
                    'total_fare' => $scheduleTickets->sum('total_fare'),
                    'base_fare' => $firstTicket->base_fare,
                    'valid_from' => $firstTicket->valid_from->format('Y-m-d H:i:s'),
                    'valid_until' => $firstTicket->valid_until->format('Y-m-d H:i:s'),
                    'booking_time' => $firstTicket->booking_time->format('Y-m-d H:i:s'),
                    'status' => 'Valid',
                    'is_expired' => false,
                    'minutes_remaining' => null,
                    'tickets' => $scheduleTickets->map(function($ticket) {
                        return [
                            'pnr' => $ticket->pnr,
                            'ticket_number' => $ticket->ticket_number,
                            'base_fare' => $ticket->base_fare,
                            'status' => 'scheduled',
                            'used_at' => null
                        ];
                    })->toArray(),
                    'active_tickets' => $scheduleTickets->where('status', 'scheduled')->count(),
                    'used_tickets' => $scheduleTickets->where('status', 'used')->count(),
                    'expired_tickets' => $scheduleTickets->where('status', 'expired')->count()
                ]
            ]);
        }
        
        return response()->json([
            'success' => false,
            'valid' => false,
            'message' => 'No booking found with this PNR number.'
        ]);
    }
}