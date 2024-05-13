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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->integer('customer_number');
            $table->decimal('total_amount', 8, 2);
            $table->decimal('sub_total', 8, 2);
            $table->decimal('tax', 8, 2);
            $table->string('payment_mode');
            $table->text('cart_items'); // Assuming JSON format for cart items
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
