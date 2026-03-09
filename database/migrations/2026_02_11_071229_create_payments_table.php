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
            $table->string('midtrans_order_id', 50)->nullable()->index();
            $table->string('midtrans_transaction_id', 50)->nullable()->index();
            $table->string('snap_token', 50)->nullable();
            $table->string('payment_type', 50)->nullable();
            $table->string('transaction_status', 20)->nullable();
            $table->string('fraud_status', 20)->nullable();
            $table->string('status_code', 10)->nullable();
            $table->decimal('gross_amount', 12, 2);
            $table->timestamp('transaction_time')->nullable();
            $table->timestamp('settlement_time')->nullable();
            $table->string('signature_key', 150)->nullable();
            $table->json('payload')->nullable();
            $table->text('payment_method_info')->nullable();
            $table->string('payment_proof', 150)->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();
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
