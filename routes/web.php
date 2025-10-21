<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketVerificationController;
use App\Http\Controllers\OneTimeTicketController;
use App\Http\Controllers\InstantBookingController;
use App\Http\Controllers\ScheduleBookingController;
use App\Http\Controllers\RouteMapController;
use App\Http\Controllers\Support\HelpCenterController;
use App\Http\Controllers\Support\ContactUsController;
use App\Http\Controllers\Support\TermsOfServiceController;
use App\Http\Controllers\Support\PrivacyPolicyController;
use App\Http\Controllers\VirtualCardController;

// Main application routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index']);
Route::get('/one-time-ticket', function () {
    $oneTimeData = [
        'title' => 'One-Time Ticketing',
        'description' => 'Book your one-time MRT ticket easily.',
        // Add more data as needed
    ];
    return view('onetime', compact('oneTimeData'));
});
// Serve the SPA shell for instant booking so React can mount at /one-time-ticket/instant
Route::get('/one-time-ticket/instant', [HomeController::class, 'index']);


Route::get('/schedule-booking', [HomeController::class, 'index']);
// Serve SPA shell for schedule booking at canonical path
Route::get('/one-time-ticket/schedule', [HomeController::class, 'index']);
// Also serve the SPA shell for the full canonical schedule path requested by the user
Route::get('/one-time-ticket/schedule-booking', [HomeController::class, 'index']);
Route::get('/verify-ticket', [HomeController::class, 'index']);
Route::get('/fare-calculator', [HomeController::class, 'index']);
Route::get('/route-map', [HomeController::class, 'index']);
Route::get('/virtual-card', [HomeController::class, 'index']);
Route::get('/virtual-card-dashboard', [HomeController::class, 'index']);
Route::get('/payment', [HomeController::class, 'index']);
Route::get('/signin', [HomeController::class, 'index']);
Route::get('/help-center', [HomeController::class, 'index']);
Route::get('/contact-us', [HomeController::class, 'index']);
Route::get('/terms-of-service', [HomeController::class, 'index']);
Route::get('/privacy-policy', [HomeController::class, 'index']);

// API routes for frontend data
Route::prefix('api')->group(function () {
    Route::get('/header-data', [HomeController::class, 'getHeaderData'])->name('api.header');
    Route::get('/footer-data', [HomeController::class, 'getFooterData'])->name('api.footer');
    Route::get('/app-config', [HomeController::class, 'getAppConfig'])->name('api.config');
    
    // Cookie management routes
    Route::get('/cookie-policy', [CookieController::class, 'getPolicy'])->name('api.cookie.policy');
    Route::get('/cookie-settings', [CookieController::class, 'getSettings'])->name('api.cookie.settings');
    Route::post('/cookie-consent', [CookieController::class, 'logConsent'])->name('api.cookie.consent');
    
    // Payment routes
    Route::get('/payment/options', [App\Http\Controllers\PaymentController::class, 'getPaymentOptions'])->name('api.payment.options');
    Route::post('/payment/process', [App\Http\Controllers\PaymentController::class, 'processPayment'])->name('api.payment.process');
    
    // Virtual Card routes
    Route::get('/virtual-card/details', [App\Http\Controllers\VirtualCardController::class, 'getDetails'])->name('api.virtual-card.details');
    Route::get('/virtual-card/status', [App\Http\Controllers\VirtualCardController::class, 'checkCardStatus'])->name('api.virtual-card.status');
    
    // Ticket verification routes
    Route::post('/verify-ticket', [TicketVerificationController::class, 'verifyTicket'])->name('api.verify.ticket');
    Route::post('/verify-pnr', [TicketVerificationController::class, 'verifyPNR'])->name('api.verify.pnr');
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
    
    // Schedule Booking routes
    Route::get('/schedule-booking/stations', [ScheduleBookingController::class, 'getStations'])->name('api.schedule.stations');
    Route::post('/schedule-booking/calculate-fare', [ScheduleBookingController::class, 'calculateFare'])->name('api.schedule.calculate');
    Route::post('/schedule-booking/create', [ScheduleBookingController::class, 'createBooking'])->name('api.schedule.create');
    Route::post('/schedule-booking/check-status', [ScheduleBookingController::class, 'checkBookingStatus'])->name('api.schedule.status');
    Route::get('/schedule-booking/statistics', [ScheduleBookingController::class, 'getBookingStatistics'])->name('api.schedule.stats');
    
    // Route Map routes
    Route::get('/route-map/data', [RouteMapController::class, 'getRouteMapData'])->name('api.routemap.data');
    Route::get('/route-map/station-details', [RouteMapController::class, 'getStationDetails'])->name('api.routemap.station');
    
    // Support routes
    Route::get('/support/help-center', [HelpCenterController::class, 'index'])->name('api.support.help');
    Route::post('/support/help-center/submit', [HelpCenterController::class, 'submitRequest'])->name('api.support.help.submit');
    Route::get('/support/contact-us', [ContactUsController::class, 'index'])->name('api.support.contact');
    Route::post('/support/contact-us/submit', [ContactUsController::class, 'submitForm'])->name('api.support.contact.submit');
    Route::get('/support/terms-of-service', [TermsOfServiceController::class, 'index'])->name('api.support.terms');
    Route::get('/support/privacy-policy', [PrivacyPolicyController::class, 'index'])->name('api.support.privacy');
    Route::post('/support/privacy-policy/accept', [PrivacyPolicyController::class, 'acceptPolicy'])->name('api.support.privacy.accept');
});


// Admin auth routes (simple cookie-based admin login)
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\Admin\AdminOverviewController;

Route::get('/admin-login', [HomeController::class, 'index'])->name('admin.login');
Route::post('/admin-login', [AdminAuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin-logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
Route::get('/admin-dashboard', [AdminAuthController::class, 'dashboard'])->name('admin.dashboard');

// Admin routes
Route::get('/admin/overview-stats', [AdminOverviewController::class, 'stats']);

// Simple verification endpoints - NO CSRF
Route::post('/simple-verify', [App\Http\Controllers\SimpleVerifyController::class, 'verify']);
Route::get('/test-verify/{pnr}', [App\Http\Controllers\SimpleVerifyController::class, 'verify']);

// Catch-all route for React Router (should be last)
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');

// Virtual Card transactions route
Route::post('/virtual-card/transactions', [VirtualCardController::class, 'transactions'])->middleware('virtualcard');
