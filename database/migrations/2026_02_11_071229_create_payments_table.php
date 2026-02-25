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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained()->cascadeOnDelete();
            $table->string('midtrans_order_id')->nullable()->index();
            $table->string('midtrans_transaction_id')->nullable()->index();
            $table->string('snap_token')->nullable();
            $table->string('payment_type')->nullable();
            $table->string('transaction_status')->nullable();
            $table->string('fraud_status')->nullable();
            $table->string('status_code')->nullable();
            $table->decimal('gross_amount', 16, 2);
            $table->timestamp('transaction_time')->nullable();
            $table->timestamp('settlement_time')->nullable();
            $table->string('signature_key')->nullable();
            $table->json('payload')->nullable();
            $table->text('payment_method_info')->nullable();
            $table->string('payment_proof')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
