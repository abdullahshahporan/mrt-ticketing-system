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
        Schema::create('instant_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('pnr', 20)->unique()->comment('MRT + 9 digits');
            $table->string('from_station', 100);
            $table->string('to_station', 100);
            $table->integer('quantity')->default(1);
            $table->decimal('base_fare', 10, 2);
            $table->decimal('total_fare', 10, 2);
            $table->string('status', 50)->default('active')->comment('active, used, expired, cancelled');
            $table->timestamp('booking_time')->useCurrent();
            $table->timestamp('valid_until')->nullable()->comment('Booking time + 1 hour');
            $table->timestamp('used_at')->nullable()->comment('When ticket was used');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            // Indexes for better performance
            $table->index('pnr');
            $table->index('status');
            $table->index('booking_time');
            $table->index('valid_until');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instant_bookings');
    }
};
