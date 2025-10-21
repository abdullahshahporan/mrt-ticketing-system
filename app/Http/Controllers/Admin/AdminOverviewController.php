<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\InstantBooking;
use App\Models\ScheduleBooking;
use App\Models\VirtualCard;
use App\Models\VirtualCardTransaction;
use Carbon\Carbon;

class AdminOverviewController extends Controller
{
    public function stats()
    {
        // One Time Ticket Info
        $today = Carbon::today();
        $todayInstant = InstantBooking::whereDate('booking_time', $today);
        $todaySchedule = ScheduleBooking::whereDate('booking_time', $today);
        $totalInstant = InstantBooking::query();
        $totalSchedule = ScheduleBooking::query();

        $ticketSoldToday = $todayInstant->count() + $todaySchedule->count();
        $totalTicketSold = $totalInstant->count() + $totalSchedule->count();
        $totalIncome = $totalInstant->sum('total_fare') + $totalSchedule->sum('total_fare');

        // Virtual Card Info
        $totalCardHolder = VirtualCard::where('is_active', true)->count();
        $vcTotalIncome = VirtualCardTransaction::where('type', 'PAYMENT')->sum('amount');
        $blockMoney = VirtualCard::sum('hold_balance');

        return response()->json([
            'one_time_ticket' => [
                'ticket_sold_today' => $ticketSoldToday,
                'total_ticket_sold' => $totalTicketSold,
                'total_income' => $totalIncome,
            ],
            'virtual_card' => [
                'total_card_holder' => $totalCardHolder,
                'total_income' => $vcTotalIncome,
                'block_money' => $blockMoney,
            ],
        ]);
    }
}
