<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

// Main application route
Route::get('/', [HomeController::class, 'index'])->name('home');

// API routes for frontend data
Route::prefix('api')->group(function () {
    Route::get('/header-data', [HomeController::class, 'getHeaderData'])->name('api.header');
    Route::get('/footer-data', [HomeController::class, 'getFooterData'])->name('api.footer');
    Route::get('/app-config', [HomeController::class, 'getAppConfig'])->name('api.config');
});

