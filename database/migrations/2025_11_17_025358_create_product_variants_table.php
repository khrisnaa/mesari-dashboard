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
        Schema::create('product_variants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);

            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('product_variant_attributes', function (Blueprint $table) {
            $table->foreignUuid('product_variant_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('attribute_id')->constrained()->onDelete('cascade');

            $table->primary(['product_variant_id', 'attribute_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_variant_attributes');
    }
};
