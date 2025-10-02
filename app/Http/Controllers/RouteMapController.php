<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RouteMapController extends Controller
{
    /**
     * Get route map information and stations data
     *
     * @return JsonResponse
     */
    public function getRouteMapData(): JsonResponse
    {
        try {
            $routeMapData = [
                'title' => 'MRT Line-6 Route Map',
                'subtitle' => 'Dhaka Metro Rail Transit System',
                'image_path' => '/logos/routemap.png',
                'description' => 'The Dhaka Metro Rail Line-6 connects 16 stations from Uttara North to Motijheel, covering a total distance of approximately 20.1 kilometers. This modern transit system provides fast, reliable, and eco-friendly transportation across Dhaka city.',
                'features' => [
                    'Total Stations: 16',
                    'Total Distance: 20.1 km',
                    'Operating Hours: 6:00 AM - 10:00 PM',
                    'Train Frequency: Every 5-7 minutes',
                    'Journey Time: Approximately 38 minutes (end to end)',
                    'Capacity: 60,000 passengers per hour per direction'
                ],
                'stations' => [
                    ['name' => 'Uttara North', 'order' => 1],
                    ['name' => 'Uttara Center', 'order' => 2],
                    ['name' => 'Uttara South', 'order' => 3],
                    ['name' => 'Pallabi', 'order' => 4],
                    ['name' => 'Mirpur 11', 'order' => 5],
                    ['name' => 'Mirpur 10', 'order' => 6],
                    ['name' => 'Kazipara', 'order' => 7],
                    ['name' => 'Shewrapara', 'order' => 8],
                    ['name' => 'Agargaon', 'order' => 9],
                    ['name' => 'Bijoy Sarani', 'order' => 10],
                    ['name' => 'Farmgate', 'order' => 11],
                    ['name' => 'Karwan Bazar', 'order' => 12],
                    ['name' => 'Shahbag', 'order' => 13],
                    ['name' => 'Dhaka University', 'order' => 14],
                    ['name' => 'Bangladesh Secretariat', 'order' => 15],
                    ['name' => 'Motijheel', 'order' => 16]
                ],
                'safety_guidelines' => [
                    'Stand on the right side of escalators',
                    'Allow passengers to exit before boarding',
                    'Keep your belongings secure',
                    'Follow platform safety lines',
                    'No smoking or eating inside trains',
                    'Priority seating for elderly, disabled, and pregnant passengers'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $routeMapData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load route map data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get station details by name
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getStationDetails(Request $request): JsonResponse
    {
        try {
            $stationName = $request->query('station');
            
            // Sample station details - in a real app, this would come from database
            $stationDetails = [
                'uttara_north' => [
                    'name' => 'Uttara North',
                    'code' => 'UN',
                    'facilities' => ['Parking', 'ATM', 'Shops', 'Restrooms'],
                    'nearby_landmarks' => ['Uttara Sector 1', 'Uttara Model Town'],
                    'first_train' => '6:00 AM',
                    'last_train' => '10:00 PM'
                ],
                'motijheel' => [
                    'name' => 'Motijheel',
                    'code' => 'MJ',
                    'facilities' => ['Parking', 'ATM', 'Shops', 'Restrooms', 'Food Court'],
                    'nearby_landmarks' => ['Bangladesh Bank', 'Shapla Chattar', 'Commercial Area'],
                    'first_train' => '6:00 AM',
                    'last_train' => '10:00 PM'
                ]
                // Add more stations as needed
            ];

            $stationKey = strtolower(str_replace(' ', '_', $stationName));
            $details = $stationDetails[$stationKey] ?? null;

            if (!$details) {
                return response()->json([
                    'success' => false,
                    'message' => 'Station details not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $details
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load station details: ' . $e->getMessage()
            ], 500);
        }
    }
}