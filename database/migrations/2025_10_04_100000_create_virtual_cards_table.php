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
        // Drop the existing tables if they exist
        Schema::dropIfExists('virtual_card_payments');
        Schema::dropIfExists('virtual_card_profiles');
        
        // Create a new combined virtual_cards table
        Schema::create('virtual_cards', function (Blueprint $table) {
            $table->id();
            // User profile info
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('contact_no', 11)->unique();
            $table->string('nid_no', 17)->unique();
            $table->date('date_of_birth');
            
            // Card info
            $table->string('card_number', 10)->nullable()->unique();
            $table->boolean('is_active')->default(false);
            
            // Balance information
            $table->decimal('balance', 10, 2)->default(0);
            $table->decimal('hold_balance', 10, 2)->default(0);
            
            // Payment information
            $table->string('last_payment_method')->nullable();
            $table->string('last_transaction_id')->nullable();
            $table->timestamp('last_paid_at')->nullable();
            
            // Tracking
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expiry_date')->nullable();
            $table->timestamps();
        });
        
        // Create a separate table for tracking all payment transactions
        Schema::create('virtual_card_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('virtual_card_id')->constrained('virtual_cards')->onDelete('cascade');
            $table->string('type'); // PAYMENT, RECHARGE, TRIP
            $table->decimal('amount', 10, 2);
            $table->string('payment_method')->nullable();
            $table->string('transaction_id')->unique();
            $table->string('status')->default('completed');
            $table->text('description')->nullable();
            $table->string('from_station')->nullable();
            $table->string('to_station')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('virtual_card_transactions');
        Schema::dropIfExists('virtual_cards');
    }
};