<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CookieController;
use App\Http\Controllers\TicketVerificationController;

// Main application routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index']);
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
});

