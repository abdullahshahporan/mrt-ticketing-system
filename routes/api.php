<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PaymentController;

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

// Profile routes
Route::post('/profile', [ProfileController::class, 'store']);
Route::get('/profile', [ProfileController::class, 'show']);

// Payment routes
Route::get('/payment/options', [PaymentController::class, 'getPaymentOptions']);
Route::post('/payment/process', [PaymentController::class, 'processPayment']);
