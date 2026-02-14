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
            $table->string('order_number')->unique()->comment('Format: ORD-20260214-001');

            // status
            $table->enum('order_status', array_column(OrderStatus::cases(), 'value'))
                ->default(OrderStatus::PENDING->value);
            $table->enum('payment_status', array_column(PaymentStatus::cases(), 'value'))
                ->default(PaymentStatus::PENDING->value);

            // snapshot payment
            $table->string('payment_method')->nullable();
            $table->string('payment_token')->nullable();
            $table->string('payment_url')->nullable();

            // pricing snapshot
            $table->decimal('subtotal', 16, 2);
            $table->decimal('shipping_price', 16, 2);
            $table->decimal('insurance_price', 16, 2)->default(0);
            $table->decimal('discount_amount', 16, 2)->default(0);
            $table->decimal('grand_total', 16, 2);

            // shipping snapshot
            $table->string('shipping_courier_code');
            $table->string('shipping_courier_service');
            $table->string('shipping_estimation')->nullable();
            $table->string('shipping_tracking_number')->nullable();

            // weight
            $table->unsignedInteger('shipping_weight');

            // address snapshot
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('recipient_address_line');
            $table->string('recipient_province');
            $table->string('recipient_city');
            $table->string('recipient_district');
            $table->string('recipient_subdistrict')->nullable();
            $table->string('postal_code')->nullable();

            // note
            $table->text('note')->nullable();
            $table->timestamps();
            $table->softDeletes();
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
