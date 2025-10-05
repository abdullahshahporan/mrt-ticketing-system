<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use App\Models\VirtualCard;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Store user profile information
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validate the incoming request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|min:2|max:255',
                'email' => 'required|email|max:255',
                'contactNo' => [
                    'required',
                    'string',
                    'regex:/^01[3-9]\d{8}$/',
                    'size:11'
                ],
                'nidNo' => [
                    'required',
                    'string',
                    'regex:/^(\d{10}|\d{13}|\d{17})$/'
                ],
                'dateOfBirth' => 'required|date|before:today|after:1900-01-01'
            ], [
                'name.required' => 'Name is required',
                'name.min' => 'Name must be at least 2 characters',
                'contactNo.required' => 'Contact number is required',
                'contactNo.regex' => 'Enter a valid 11-digit Bangladesh mobile number (e.g., 01712345678)',
                'contactNo.size' => 'Contact number must be exactly 11 digits',
                'nidNo.required' => 'NID number is required',
                'nidNo.regex' => 'Enter a valid NID number (10, 13, or 17 digits)',
                'dateOfBirth.required' => 'Date of birth is required',
                'dateOfBirth.before' => 'Date of birth must be before today',
                'dateOfBirth.after' => 'Please enter a valid date of birth'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();

            // Additional age validation
            $dateOfBirth = new \DateTime($validatedData['dateOfBirth']);
            $today = new \DateTime();
            $age = $today->diff($dateOfBirth)->y;

            if ($age < 13) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'dateOfBirth' => ['You must be at least 13 years old']
                    ]
                ], 422);
            }

            if ($age > 120) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'dateOfBirth' => ['Please enter a valid date of birth']
                    ]
                ], 422);
            }

            // In a real app, we'd get this from authentication
            // For now, we'll just use null as we're not requiring user login
            $userId = null;

            // Save or update the profile in the database
            $profile = VirtualCard::updateOrCreate(
                ['email' => $validatedData['email']],
                [
                    'user_id' => $userId,
                    'name' => $validatedData['name'],
                    'contact_no' => $validatedData['contactNo'],
                    'nid_no' => $validatedData['nidNo'],
                    'date_of_birth' => $validatedData['dateOfBirth'],
                    'is_active' => false, // Will be activated after payment
                ]
            );
            
            // Generate a card number if it doesn't have one
            if (!$profile->card_number) {
                $profile->generateCardNumber();
            }

            // Log the profile data
            Log::info('Profile saved to database', ['profile_id' => $profile->id]);

            return response()->json([
                'success' => true,
                'message' => 'Profile completed successfully! 🎉',
                'redirect' => '/payment',
                'data' => $validatedData
            ], 200);

        } catch (\Exception $e) {
            Log::error('Profile completion failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete profile. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user profile information
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $email = $request->query('email');
            
            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email parameter is required'
                ], 400);
            }

            // Fetch profile from database
            $profile = VirtualCard::where('email', $email)->first();
            
            if ($profile) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'name' => $profile->name,
                        'email' => $profile->email,
                        'contactNo' => $profile->contact_no,
                        'nidNo' => $profile->nid_no,
                        'dateOfBirth' => $profile->date_of_birth,
                        'isActive' => $profile->is_active,
                        'cardNumber' => $profile->card_number,
                        'profileCompleted' => true,
                        'hasCard' => $profile->is_active,
                        'balance' => $profile->balance,
                        'holdBalance' => $profile->hold_balance
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'name' => '',
                    'email' => $email,
                    'contactNo' => '',
                    'nidNo' => '',
                    'dateOfBirth' => '',
                    'isActive' => false,
                    'cardNumber' => null,
                    'profileCompleted' => false,
                    'hasCard' => false,
                    'balance' => 0,
                    'holdBalance' => 0
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch profile: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile data'
            ], 500);
        }
    }
}