<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
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
            $table->string('order_number', 50)->unique();
            $table->enum('order_status', array_column(OrderStatus::cases(), 'value'))->default(OrderStatus::PENDING->value);
            $table->enum('payment_status', array_column(PaymentStatus::cases(), 'value'))->default(PaymentStatus::PENDING->value);
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_cost', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2);
            $table->string('shipping_courier_code', 20);
            $table->string('shipping_courier_service', 50);
            $table->string('shipping_estimation', 50)->nullable();
            $table->string('shipping_tracking_number', 50)->nullable();
            $table->unsignedInteger('shipping_weight');
            $table->string('recipient_name', 100);
            $table->string('recipient_phone', 20);
            $table->text('recipient_address_line');
            $table->string('recipient_province', 100);
            $table->string('recipient_city', 100);
            $table->string('recipient_district', 100);
            $table->string('recipient_subdistrict', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->text('note')->nullable();
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
