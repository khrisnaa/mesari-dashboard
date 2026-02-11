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
            $table->enum('order_status', array_column(OrderStatus::cases(), 'value'))->default(OrderStatus::PENDING->value);
            $table->enum('payment_status', array_column(PaymentStatus::cases(), 'value'))->default(PaymentStatus::PENDING->value);
            $table->string('payment_method');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('total', 12, 2);
            $table->string('recipient_name', 255);
            $table->string('recipient_phone', 20);
            $table->text('recipient_address');
            $table->string('province_name', 255);
            $table->string('city_name', 255);
            $table->string('postal_code', 20);
            $table->string('shipping_courier');
            $table->string('shipping_service');
            $table->decimal('shipping_cost', 12, 2);
            $table->decimal('shipping_weight', 8, 2);
            $table->string('shipping_estimation', 50)->nullable();
            $table->timestamps();
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
