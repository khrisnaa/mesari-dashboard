<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
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
            $table->enum('status', array_column(OrderStatus::cases(), 'value'))->default(OrderStatus::PENDING->value);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('payment_method');
            $table->enum('payment_status', array_column(PaymentStatus::cases(), 'value'))->default(PaymentStatus::PENDING->value);
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
