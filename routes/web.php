<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\TicketVerificationController;
use App\Http\Controllers\OneTimeTicketController;
use App\Http\Controllers\InstantBookingController;

// Main application routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index']);
Route::get('/one-time-ticket', [HomeController::class, 'index']);
Route::get('/instant-booking', [HomeController::class, 'index']); // Add instant booking route
Route::get('/verify-ticket', [HomeController::class, 'index']); // Verify ticket route
Route::get('/privacy-policy', [HomeController::class, 'index']); // Cookie policy page

// API routes for frontend data
Route::prefix('api')->group(function () {
    Route::get('/header-data', [HomeController::class, 'getHeaderData'])->name('api.header');
    Route::get('/footer-data', [HomeController::class, 'getFooterData'])->name('api.footer');
    Route::get('/app-config', [HomeController::class, 'getAppConfig'])->name('api.config');
    
    // Cookie management routes
    Route::get('/cookie-policy', [CookieController::class, 'getPolicy'])->name('api.cookie.policy');
    Route::get('/cookie-settings', [CookieController::class, 'getSettings'])->name('api.cookie.settings');
    Route::post('/cookie-consent', [CookieController::class, 'logConsent'])->name('api.cookie.consent');
    
    // Ticket verification routes
    Route::post('/verify-ticket', [TicketVerificationController::class, 'verifyTicket'])->name('api.verify.ticket');
    Route::get('/verification-policy', [TicketVerificationController::class, 'getVerificationPolicy'])->name('api.verify.policy');
    Route::get('/verification-stats', [TicketVerificationController::class, 'getVerificationStats'])->name('api.verify.stats');
    
    // One Time Ticket routes
    Route::get('/one-time-ticket/options', [OneTimeTicketController::class, 'getBookingOptions'])->name('api.one-time.options');
    Route::post('/one-time-ticket/instant', [OneTimeTicketController::class, 'initializeInstantBooking'])->name('api.one-time.instant');
    Route::post('/one-time-ticket/scheduled', [OneTimeTicketController::class, 'initializeScheduledBooking'])->name('api.one-time.scheduled');
    Route::get('/one-time-ticket/stats', [OneTimeTicketController::class, 'getBookingStats'])->name('api.one-time.stats');
    
    // Instant Booking routes
    Route::get('/instant-booking/stations', [InstantBookingController::class, 'getStations'])->name('api.instant.stations');
    Route::post('/instant-booking/calculate-fare', [InstantBookingController::class, 'calculateFare'])->name('api.instant.calculate');
    Route::post('/instant-booking/create', [InstantBookingController::class, 'createBooking'])->name('api.instant.create');
    Route::get('/instant-booking/status/{pnr}', [InstantBookingController::class, 'getBookingByPNR'])->name('api.instant.pnr');
    Route::post('/instant-booking/check-status', [InstantBookingController::class, 'checkBookingStatus'])->name('api.instant.status');
    Route::post('/instant-booking/expire-old', [InstantBookingController::class, 'expireOldBookings'])->name('api.instant.expire');
    Route::get('/instant-booking/statistics', [InstantBookingController::class, 'getBookingStatistics'])->name('api.instant.stats');
});

// Catch-all route for React Router (should be last)
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');
