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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'paid', 'packed', 'shipped', 'completed', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('payment_method');
            $table->enum('payment_status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('shipping_courier');
            $table->string('shipping_service');
            $table->decimal('shipping_cost', 10, 2);
            $table->decimal('shipping_weight', 8, 2);
            $table->date('shipping_etd');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
