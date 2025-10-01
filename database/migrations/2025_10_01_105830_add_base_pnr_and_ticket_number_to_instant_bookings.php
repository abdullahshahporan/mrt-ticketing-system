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
        Schema::table('instant_bookings', function (Blueprint $table) {
            // Drop the unique constraint on pnr first
            $table->dropUnique(['pnr']);
            
            // Add base_pnr column to store the original booking PNR
            $table->string('base_pnr', 20)->after('pnr')->nullable()->comment('Base PNR without ticket number');
            
            // Add ticket_number to identify individual tickets
            $table->integer('ticket_number')->after('base_pnr')->default(1)->comment('Individual ticket number in booking');
            
            // Modify pnr to allow longer format (MRT123456789-1, MRT123456789-2, etc.)
            $table->string('pnr', 25)->change()->comment('MRT + 9 digits + - + ticket number');
            
            // Add indexes
            $table->index('base_pnr');
            $table->index(['base_pnr', 'ticket_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('instant_bookings', function (Blueprint $table) {
            $table->dropIndex(['instant_bookings_base_pnr_index']);
            $table->dropIndex(['instant_bookings_base_pnr_ticket_number_index']);
            $table->dropColumn(['base_pnr', 'ticket_number']);
            $table->string('pnr', 20)->change();
            $table->unique('pnr');
        });
    }
};
