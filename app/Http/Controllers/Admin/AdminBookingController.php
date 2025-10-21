<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InstantBooking;
use App\Models\ScheduleBooking;

class AdminBookingController extends Controller
{
    // GET /admin/instant-bookings
    public function getInstantBookings()
    {
        $bookings = InstantBooking::select([
            'id',
            'pnr',
            'from_station',
            'to_station',
            'quantity',
            'status',
            'booking_time'
        ])->get();
        return response()->json($bookings);
    }

    // GET /admin/schedule-bookings
    public function getScheduleBookings()
    {
        $bookings = ScheduleBooking::select([
            'id',
            'pnr',
            'from_station',
            'to_station',
            'quantity',
            'travel_date',
            'status',
            'booking_time'
        ])->get();
        return response()->json($bookings);
    }
}
