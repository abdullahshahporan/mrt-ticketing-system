<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\VirtualCard;
use App\Models\VirtualCardTransaction;

class PaymentController extends Controller
{
    /**
     * Process virtual MRT card payment
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function processPayment(Request $request): JsonResponse
    {
        try {
            // Validate the payment request
            $validator = Validator::make($request->all(), [
                'amount' => 'required|numeric|min:200',
                'paymentMethod' => 'required|string',
                'userEmail' => 'required|email'
            ], [
                'amount.required' => 'Payment amount is required',
                'amount.min' => 'Minimum amount for Virtual MRT Card is ৳200 (block money)',
                'paymentMethod.required' => 'Please select a payment method',
                'userEmail.required' => 'User email is required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            // Find the virtual card by email
            $virtualCard = VirtualCard::where('email', $validatedData['userEmail'])->first();
            
            if (!$virtualCard) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found. Please complete your profile first.',
                    'redirect' => '/virtual-card'
                ], 404);
            }
            
            // Process the payment using our model method which handles all the transaction creation
            $paymentResult = $virtualCard->processPayment(
                $validatedData['amount'],
                $validatedData['paymentMethod']
            );
            
            Log::info('Virtual MRT Card payment processed', [
                'virtual_card_id' => $virtualCard->id,
                'transaction_id' => $paymentResult['transaction_id'],
                'amount' => $paymentResult['amount']
            ]);

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully!',
                'data' => [
                    'transaction_id' => $paymentResult['transaction_id'],
                    'amount' => $paymentResult['amount'],
                    'payment_method' => $virtualCard->last_payment_method,
                    'status' => 'completed',
                    'card_number' => $virtualCard->card_number,
                    'balance' => $paymentResult['available_balance'],
                    'hold_balance' => $paymentResult['hold_balance']
                ],
                'redirect' => '/virtual-card-dashboard'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Payment processing failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred during payment processing'
            ], 500);
        }
    }

    /**
     * Get payment options and information
     *
     * @return JsonResponse
     */
    public function getPaymentOptions(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'minimum_amount' => 200,
                'block_money' => 200,
                'currency' => 'BDT',
                'payment_methods' => [
                    'bkash' => [
                        'name' => 'bKash',
                        'fee' => 0,
                        'available' => true
                    ],
                    'nagad' => [
                        'name' => 'Nagad',
                        'fee' => 0,
                        'available' => true
                    ],
                    'rocket' => [
                        'name' => 'Rocket',
                        'fee' => 0,
                        'available' => true
                    ],
                    'bank_card' => [
                        'name' => 'Bank Card',
                        'fee' => 0,
                        'available' => true
                    ]
                ]
            ]
        ]);
    }
}