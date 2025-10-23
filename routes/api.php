<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\VirtualCardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Admin profile routes
use App\Http\Controllers\Admin\AdminProfileController;
Route::post('/admin/profile', [AdminProfileController::class, 'store']);
Route::get('/admin/profile/{id}', [AdminProfileController::class, 'show']);

// User profile creation route
Route::post('/profile', [ProfileController::class, 'store']);

// Payment routes
Route::get('/payment/options', [PaymentController::class, 'getPaymentOptions']);
Route::post('/payment/process', [PaymentController::class, 'processPayment']);


// Admin booking APIs
use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\VirtualCardInfo;
Route::get('/admin/instant-bookings', [AdminBookingController::class, 'getInstantBookings']);
Route::get('/admin/schedule-bookings', [AdminBookingController::class, 'getScheduleBookings']);
// Virtual card API for admin dashboard
Route::get('/admin/virtual-cards', [VirtualCardInfo::class, 'getAllCards']);
// Virtual card API
Route::get('/virtual-card/details', [VirtualCardController::class, 'getDetails']);
Route::get('/virtual-card/status', [VirtualCardController::class, 'checkCardStatus']);
Route::get('/virtual-card/transactions', [VirtualCardController::class, 'getTransactions']);
