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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150)->index();
            $table->string('slug', 160)->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('weight')->default(0);
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_highlighted')->default(false);
            $table->boolean('is_customizable')->default(false);
            $table->decimal('custom_additional_price', 12, 2)->nullable();
            $table->string('discount_type', 20)->nullable();
            $table->decimal('discount_value', 10, 2)->default(0)->nullable();
            $table->timestamp('discount_start_at')->nullable();
            $table->timestamp('discount_end_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
