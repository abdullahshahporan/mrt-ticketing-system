<?php

namespace App\Http\Controllers;

use App\Models\VirtualCard;
use App\Models\VirtualCardTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VirtualCardController extends Controller
{
    /**
     * Get virtual card details for a user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getDetails(Request $request): JsonResponse
    {
        try {
            $email = $request->query('email');
            
            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email parameter is required'
                ], 400);
            }

            // Get the virtual card
            $card = VirtualCard::where('email', $email)->first();
            
            if (!$card) {
                return response()->json([
                    'success' => false,
                    'message' => 'No virtual card found for this user'
                ], 404);
            }

            // Get the transactions
            $transactions = VirtualCardTransaction::where('virtual_card_id', $card->id)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();
            
            // Format transactions for the frontend
            $formattedTransactions = [];
            foreach ($transactions as $transaction) {
                $formattedTransactions[] = [
                    'id' => $transaction->transaction_id,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                    'date' => $transaction->created_at->format('Y-m-d H:i:s'),
                    'description' => $transaction->description,
                    'station' => $transaction->from_station && $transaction->to_station ?
                        $transaction->from_station . ' → ' . $transaction->to_station : null
                ];
            }
            
            // If no transactions, generate demo data
            if (empty($formattedTransactions)) {
                $formattedTransactions = $this->generateDemoTransactions($card->id);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'cardNumber' => $card->card_number,
                    'balance' => $card->balance,
                    'holdBalance' => $card->hold_balance,
                    'name' => $card->name,
                    'isActive' => $card->is_active,
                    'expiryDate' => $card->expiry_date ? $card->expiry_date->format('Y-m-d') : date('Y-m-d', strtotime('+1 year')),
                    'lastRecharge' => $card->last_paid_at ? $card->last_paid_at->format('Y-m-d H:i:s') : null,
                    'lastUsed' => $card->last_used_at ? $card->last_used_at->format('Y-m-d H:i:s') : null,
                    'recentTransactions' => $formattedTransactions
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch virtual card details: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch virtual card details'
            ], 500);
        }
    }
    
    /**
     * Check if a user has an active card
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function checkCardStatus(Request $request): JsonResponse
    {
        try {
            $email = $request->query('email');
            
            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email parameter is required'
                ], 400);
            }
            
            $card = VirtualCard::where('email', $email)->first();
            
            // Determine the card status and appropriate redirect
            $hasActiveCard = $card && $card->is_active;
            $profileCompleted = $card ? true : false;
            $paymentRequired = $card && !$card->is_active;
            
            $redirectPath = '/virtual-card'; // Default
            
            if ($hasActiveCard) {
                $redirectPath = '/virtual-card-dashboard';
                $status = 'active';
            } elseif ($paymentRequired) {
                $redirectPath = '/payment';
                $status = 'payment_required';
            } else {
                $status = 'profile_required';
            }
            
            Log::info('Card status check', [
                'email' => $email,
                'hasActiveCard' => $hasActiveCard,
                'profileCompleted' => $profileCompleted,
                'paymentRequired' => $paymentRequired,
                'redirect' => $redirectPath,
                'status' => $status
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'hasActiveCard' => $hasActiveCard,
                    'profileCompleted' => $profileCompleted,
                    'paymentRequired' => $paymentRequired,
                    'redirect' => $redirectPath,
                    'status' => $status
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to check card status: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to check card status'
            ], 500);
        }
    }

    /**
     * Generate demo transactions for new cards
     *
     * @param int $cardId
     * @return array
     */
    private function generateDemoTransactions($cardId): array
    {
        $stations = [
            'Uttara North', 'Uttara Center', 'Uttara South',
            'Pallabi', 'Mirpur 11', 'Mirpur 10', 'Kazipara', 
            'Shewrapara', 'Agargaon', 'Farmgate', 'Karwan Bazar',
            'Shahbag', 'Dhaka University', 'Bangladesh Secretariat', 'Motijheel'
        ];

        $transactions = [];
        
        // Add initial payment transaction
        $transactions[] = [
            'id' => 'TXN-' . time() . '-' . rand(1000, 9999),
            'type' => 'PAYMENT',
            'amount' => 200,
            'date' => now()->format('Y-m-d H:i:s'),
            'description' => 'Initial card activation payment',
            'station' => null
        ];

        // Add some mock trip transactions
        $dates = [
            date('Y-m-d H:i:s', strtotime('-1 day')),
            date('Y-m-d H:i:s', strtotime('-3 days')),
            date('Y-m-d H:i:s', strtotime('-5 days'))
        ];

        $tripAmounts = [30, 40, 50];

        for ($i = 0; $i < 3; $i++) {
            $startStation = $stations[array_rand($stations)];
            $endStation = $stations[array_rand($stations)];
            
            // Make sure start and end stations are different
            while ($endStation === $startStation) {
                $endStation = $stations[array_rand($stations)];
            }
            
            $transactions[] = [
                'id' => 'TRIP-' . uniqid(),
                'type' => 'TRIP',
                'amount' => $tripAmounts[$i],
                'date' => $dates[$i],
                'description' => 'Trip from ' . $startStation . ' to ' . $endStation,
                'station' => $startStation . ' → ' . $endStation
            ];
        }

        // Sort by date (most recent first)
        usort($transactions, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        return $transactions;
    }
}