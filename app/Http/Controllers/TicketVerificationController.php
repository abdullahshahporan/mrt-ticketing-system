<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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
            // Validate the request
            $validator = Validator::make($request->all(), [
                'pnrNumber' => 'required|string|min:6|max:20',
                'mobileNumber' => 'required|string|regex:/^[0-9]{11}$/',
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
                'mobile' => substr($mobileNumber, 0, 3) . 'XXXXX' . substr($mobileNumber, -3),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // TODO: Replace this with actual database lookup
            // For now, we'll use mock data for demonstration
            $verificationResult = $this->mockTicketVerification($pnrNumber, $mobileNumber);

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
     * Mock ticket verification for demonstration
     * TODO: Replace with actual database queries
     *
     * @param string $pnrNumber
     * @param string $mobileNumber
     * @return array
     */
    private function mockTicketVerification(string $pnrNumber, string $mobileNumber): array
    {
        // Mock valid tickets for demonstration
        $validTickets = [
            'MRT001' => [
                'mobile' => '01712345678',
                'data' => [
                    'pnr' => 'MRT001',
                    'passengerName' => 'John Doe',
                    'from' => 'Uttara North',
                    'to' => 'Motijheel',
                    'journeyDate' => '2025-10-01',
                    'seatNumber' => 'A12',
                    'status' => 'Confirmed'
                ]
            ],
            'MRT002' => [
                'mobile' => '01612345678',
                'data' => [
                    'pnr' => 'MRT002',
                    'passengerName' => 'Jane Smith',
                    'from' => 'Shahbag',
                    'to' => 'Farmgate',
                    'journeyDate' => '2025-10-02',
                    'seatNumber' => 'B05',
                    'status' => 'Confirmed'
                ]
            ],
            'MRT003' => [
                'mobile' => '01512345678',
                'data' => [
                    'pnr' => 'MRT003',
                    'passengerName' => 'Ahmed Rahman',
                    'from' => 'Kazipara',
                    'to' => 'Dhaka University',
                    'journeyDate' => '2025-10-03',
                    'seatNumber' => 'C18',
                    'status' => 'Confirmed'
                ]
            ]
        ];

        // Check if PNR exists and mobile matches
        if (isset($validTickets[$pnrNumber])) {
            if ($validTickets[$pnrNumber]['mobile'] === $mobileNumber) {
                return [
                    'isValid' => true,
                    'ticket' => $validTickets[$pnrNumber]['data'],
                    'message' => 'Ticket verified successfully'
                ];
            } else {
                return [
                    'isValid' => false,
                    'message' => 'Mobile number does not match with PNR'
                ];
            }
        }

        return [
            'isValid' => false,
            'message' => 'Invalid PNR number or ticket not found'
        ];
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
                'requirements' => [
                    'PNR number must be exactly as provided in your booking confirmation',
                    'Mobile number must match the number used during booking',
                    'Both fields are mandatory for verification',
                    'Verification is case-sensitive'
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
}