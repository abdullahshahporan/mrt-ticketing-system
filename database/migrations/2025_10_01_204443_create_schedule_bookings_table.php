<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedule_bookings', function (Blueprint $table) {
            $table->id();
            
            // PNR and ticket identification
            $table->string('pnr', 20)->unique(); // Full PNR: MRTS123456789-1
            $table->string('base_pnr', 15)->index(); // Base PNR: MRTS123456789
            $table->integer('ticket_number'); // Ticket number within base PNR (1, 2, 3...)
            
            // Contact and booking details
            $table->string('contact_number', 15); // 11-digit mobile number
            $table->string('from_station', 50);
            $table->string('to_station', 50);
            $table->integer('quantity')->default(1); // Each record = 1 ticket
            
            // Fare information
            $table->decimal('base_fare', 8, 2); // Per ticket fare
            $table->decimal('total_fare', 8, 2); // Same as base_fare for individual tickets
            
            // Travel timing
            $table->date('travel_date');
            $table->string('time_slot', 20); // e.g., "09:30 - 10:30"
            $table->datetime('valid_from'); // Start of validity window
            $table->datetime('valid_until'); // End of validity window (1 hour later)
            
            // Status tracking
            $table->enum('status', ['scheduled', 'used', 'expired', 'cancelled'])->default('scheduled');
            $table->datetime('booking_time'); // When booking was created
            $table->datetime('used_at')->nullable(); // When ticket was used
            
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['base_pnr', 'ticket_number']);
            $table->index(['contact_number', 'travel_date']);
            $table->index(['status', 'travel_date']);
            $table->index(['valid_from', 'valid_until']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_bookings');
    }
};
