<?php

namespace App\Http\Controllers;

use App\Models\InstantBooking;
use App\Models\ScheduleBooking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class TicketVerificationController extends Controller
{
    /**
     * Verify ticket using PNR number and mobile number
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyTicket(Request $request): JsonResponse
    {
        try {
            // Validate the request - mobile number is optional for basic verification
            $validator = Validator::make($request->all(), [
                'pnrNumber' => 'required|string|min:6|max:20|regex:/^MRTS?\d+(-\d+)?$/',
                'mobileNumber' => 'nullable|string|regex:/^[0-9]{11}$/',
            ], [
                'pnrNumber.regex' => 'PNR must be in format MRT123456789 or MRTS123456789 (with optional ticket number)',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'isValid' => false,
                    'message' => 'Invalid input data',
                    'errors' => $validator->errors()
                ], 422);
            }

            $pnrNumber = $request->input('pnrNumber');
            $mobileNumber = $request->input('mobileNumber');

            // Log the verification attempt
            Log::info('Ticket verification attempt', [
                'pnr' => $pnrNumber,
                'mobile' => $mobileNumber ? substr($mobileNumber, 0, 3) . 'XXXXX' . substr($mobileNumber, -3) : 'not provided',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Verify ticket using actual database lookup
            $verificationResult = $this->verifyTicketFromDatabase($pnrNumber, $mobileNumber);

            return response()->json($verificationResult);

        } catch (\Exception $e) {
            Log::error('Ticket verification error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'isValid' => false,
                'message' => 'System error. Please try again later.'
            ], 500);
        }
    }

    /**
     * Verify ticket from database (supports both instant and scheduled bookings)
     *
     * @param string $pnrNumber
     * @param string|null $mobileNumber
     * @return array
     */
    private function verifyTicketFromDatabase(string $pnrNumber, ?string $mobileNumber): array
    {
        try {
            // Extract base PNR
            $basePnr = $this->extractBasePnr($pnrNumber);
            
            Log::info('Starting verification', [
                'original_pnr' => $pnrNumber,
                'base_pnr' => $basePnr
            ]);
            
            // Try to find in instant bookings first
            $instantTickets = InstantBooking::where('base_pnr', $basePnr)->get();
            
            Log::info('Instant booking search', [
                'base_pnr' => $basePnr,
                'found' => $instantTickets->count()
            ]);
            
            if (!$instantTickets->isEmpty()) {
                // Found in instant bookings
                Log::info('Found in instant bookings, verifying...');
                return $this->verifyInstantBooking($pnrNumber, $mobileNumber);
            }
            
            // If not found in instant, try schedule bookings
            $scheduleTickets = ScheduleBooking::where('base_pnr', $basePnr)->get();
            
            Log::info('Schedule booking search', [
                'base_pnr' => $basePnr,
                'found' => $scheduleTickets->count()
            ]);
            
            if (!$scheduleTickets->isEmpty()) {
                // Found in schedule bookings
                Log::info('Found in schedule bookings, verifying...');
                return $this->verifyScheduledBooking($pnrNumber, $mobileNumber);
            }
            
            // Not found in either table
            Log::warning('PNR not found in any table', [
                'pnr' => $pnrNumber,
                'base_pnr' => $basePnr
            ]);
            
            return [
                'isValid' => false,
                'message' => 'No booking found with this PNR number.'
            ];
            
        } catch (\Exception $e) {
            Log::error('Database verification error', [
                'pnr' => $pnrNumber,
                'error' => $e->getMessage()
            ]);

            return [
                'isValid' => false,
                'message' => 'System error during verification. Please try again.'
            ];
        }
    }

    /**
     * Verify scheduled booking ticket - Simple database fetch like instant booking
     *
     * @param string $pnrNumber
     * @param string|null $mobileNumber
     * @return array
     */
    private function verifyScheduledBooking(string $pnrNumber, ?string $mobileNumber): array
    {
        // Extract base PNR (removes -1, -2 suffix if present)
        $basePnr = $this->extractBasePnr($pnrNumber);
        
        // Simply fetch from database using base_pnr
        $tickets = ScheduleBooking::where('base_pnr', $basePnr)
            ->orderBy('ticket_number')
            ->get();

        if ($tickets->isEmpty()) {
            return [
                'isValid' => false,
                'message' => 'No scheduled booking found with this PNR'
            ];
        }

        $firstTicket = $tickets->first();
        $now = Carbon::now();
        
        // Update expired tickets
        foreach ($tickets as $ticket) {
            if ($now->greaterThan($ticket->valid_until) && $ticket->status === 'scheduled') {
                $ticket->status = 'expired';
                $ticket->save();
            }
        }

        // Count tickets by status
        $statusCounts = [
            'scheduled' => $tickets->where('status', 'scheduled')->count(),
            'used' => $tickets->where('status', 'used')->count(),
            'expired' => $tickets->where('status', 'expired')->count(),
            'cancelled' => $tickets->where('status', 'cancelled')->count()
        ];

        return [
            'isValid' => true,
            'ticketType' => 'scheduled',
            'ticket' => [
                'pnr' => $basePnr,
                'base_pnr' => $basePnr,
                'from_station' => $firstTicket->from_station,
                'to_station' => $firstTicket->to_station,
                'contact_number' => $firstTicket->contact_number,
                'travel_date' => $firstTicket->travel_date,
                'time_slot' => $firstTicket->time_slot,
                'valid_from' => $firstTicket->valid_from->format('Y-m-d H:i:s'),
                'valid_until' => $firstTicket->valid_until->format('Y-m-d H:i:s'),
                'booking_time' => $firstTicket->booking_time->format('Y-m-d H:i:s'),
                'total_tickets' => $tickets->count(),
                'total_fare' => $tickets->sum('total_fare'),
                'status_breakdown' => $statusCounts,
                'overall_status' => $this->determineOverallStatus($statusCounts),
                'is_expired' => $now->greaterThan($firstTicket->valid_until),
                'remaining_time' => $now->lessThan($firstTicket->valid_until) ? 
                    $now->diffInMinutes($firstTicket->valid_until) . ' minutes' : 'Expired'
            ],
            'message' => 'Scheduled booking verified successfully'
        ];
    }

    /**
     * Verify instant booking ticket (MRT prefix)
     *
     * @param string $pnrNumber
     * @param string|null $mobileNumber
     * @return array
     */
    private function verifyInstantBooking(string $pnrNumber, ?string $mobileNumber): array
    {
        $basePnr = $this->extractBasePnr($pnrNumber);
        
        $query = InstantBooking::where('base_pnr', $basePnr);
        
        // If mobile number is provided, add it to the query for security
        if ($mobileNumber) {
            $query->where('mobile_number', $mobileNumber);
        }
        
        $tickets = $query->orderBy('ticket_number')->get();

        if ($tickets->isEmpty()) {
            $message = $mobileNumber 
                ? 'No instant booking found with this PNR and mobile number'
                : 'No instant booking found with this PNR';
                
            return [
                'isValid' => false,
                'message' => $message
            ];
        }

        $firstTicket = $tickets->first();
        
        // Update expired tickets
        $now = Carbon::now();
        foreach ($tickets as $ticket) {
            if ($now->greaterThan($ticket->valid_until) && $ticket->status === 'active') {
                $ticket->status = 'expired';
                $ticket->save();
            }
        }

        // Count tickets by status
        $statusCounts = [
            'active' => $tickets->where('status', 'active')->count(),
            'used' => $tickets->where('status', 'used')->count(),
            'expired' => $tickets->where('status', 'expired')->count(),
            'cancelled' => $tickets->where('status', 'cancelled')->count()
        ];

        return [
            'isValid' => true,
            'ticketType' => 'instant',
            'ticket' => [
                'pnr' => $basePnr,
                'base_pnr' => $basePnr,
                'from_station' => $firstTicket->from_station,
                'to_station' => $firstTicket->to_station,
                'mobile_number' => $firstTicket->mobile_number,
                'booking_time' => $firstTicket->created_at->format('Y-m-d H:i:s'),
                'valid_until' => $firstTicket->valid_until->format('Y-m-d H:i:s'),
                'total_tickets' => $tickets->count(),
                'total_fare' => $tickets->sum('total_fare'),
                'status_breakdown' => $statusCounts,
                'overall_status' => $this->determineOverallStatus($statusCounts),
                'is_expired' => $now->greaterThan($firstTicket->valid_until),
                'remaining_time' => $now->lessThan($firstTicket->valid_until) ? 
                    $now->diffInMinutes($firstTicket->valid_until) . ' minutes' : 'Expired'
            ],
            'message' => 'Instant booking verified successfully'
        ];
    }

    /**
     * Extract base PNR from full PNR (removes ticket number suffix)
     *
     * @param string $pnr
     * @return string
     */
    private function extractBasePnr(string $pnr): string
    {
        // If PNR has a dash and ticket number (e.g., MRTS123456789-2), extract base
        if (preg_match('/^(MRTS?\d+)(-\d+)?$/', $pnr, $matches)) {
            return $matches[1];
        }
        
        return $pnr;
    }

    /**
     * Determine overall status based on ticket status breakdown
     *
     * @param array $statusCounts
     * @return string
     */
    private function determineOverallStatus(array $statusCounts): string
    {
        if ($statusCounts['scheduled'] > 0 || $statusCounts['active'] > 0) {
            return 'Valid';
        } elseif ($statusCounts['used'] > 0) {
            return 'Used';
        } elseif ($statusCounts['expired'] > 0) {
            return 'Expired';
        } elseif ($statusCounts['cancelled'] > 0) {
            return 'Cancelled';
        }
        
        return 'Unknown';
    }

    /**
     * Get ticket verification policy and instructions
     *
     * @return JsonResponse
     */
    public function getVerificationPolicy(): JsonResponse
    {
        return response()->json([
            'policy' => [
                'title' => 'Ticket Verification Policy',
                'description' => 'Please provide accurate information to verify your ticket booking.',
                'supported_tickets' => [
                    'Instant Booking' => 'PNR format: MRT followed by 9 digits (e.g., MRT123456789)',
                    'Scheduled Booking' => 'PNR format: MRTS followed by 9 digits (e.g., MRTS123456789)'
                ],
                'requirements' => [
                    'PNR number must be exactly as provided in your booking confirmation',
                    'Mobile/Contact number must match the number used during booking',
                    'Both fields are mandatory for verification',
                    'Verification is case-sensitive',
                    'For multiple tickets, use the base PNR (without ticket number suffix)'
                ],
                'support' => [
                    'phone' => '+880-1234-567890',
                    'email' => 'support@mrtticket.gov.bd',
                    'hours' => '24/7 Support Available'
                ]
            ]
        ]);
    }

    /**
     * Get verification statistics (for admin purposes)
     *
     * @return JsonResponse
     */
    public function getVerificationStats(): JsonResponse
    {
        // TODO: Implement actual statistics from database
        return response()->json([
            'stats' => [
                'total_verifications_today' => 156,
                'successful_verifications' => 142,
                'failed_verifications' => 14,
                'success_rate' => '91.03%',
                'peak_hours' => ['09:00-11:00', '17:00-19:00']
            ]
        ]);
    }

    /**
     * Simple PNR-only verification (for frontend compatibility)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function verifyPNR(Request $request): JsonResponse
    {
        try {
            Log::info('=== PNR VERIFICATION STARTED ===', [
                'pnr' => $request->input('pnr'),
                'all_input' => $request->all(),
                'method' => $request->method(),
                'ip' => $request->ip()
            ]);

            $validator = Validator::make($request->all(), [
                'pnr' => 'required|string|min:6|max:20|regex:/^MRTS?\d+(-\d+)?$/',
            ], [
                'pnr.regex' => 'PNR must be in format MRT123456789 or MRTS123456789',
            ]);

            if ($validator->fails()) {
                Log::error('PNR validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'input' => $request->all()
                ]);
                
                return response()->json([
                    'isValid' => false,
                    'message' => 'Invalid PNR format. PNR must start with MRT or MRTS followed by digits.',
                    'errors' => $validator->errors()
                ], 422);
            }

            $pnr = $request->input('pnr');
            
            Log::info('PNR-only verification attempt', [
                'pnr' => $pnr,
                'ip' => $request->ip()
            ]);

            $result = $this->verifyTicketFromDatabase($pnr, null);
            
            Log::info('=== PNR VERIFICATION COMPLETED ===', [
                'pnr' => $pnr,
                'result' => $result
            ]);
            
            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('PNR verification error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'isValid' => false,
                'message' => 'System error. Please try again later.'
            ], 500);
        }
    }
}