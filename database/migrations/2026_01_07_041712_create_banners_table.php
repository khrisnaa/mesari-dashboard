<?php

use App\Enums\BannerType;
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
        Schema::create('banners', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 100);
            $table->string('description', 200);
            $table->string('backdrop_path', 150);
            $table->string('image_path', 150);
            $table->enum('cta_type', array_column(BannerType::cases(), 'value'))->default(BannerType::NONE->value);
            $table->string('cta_text', 50)->nullable();
            $table->uuid('cta_target_id')->nullable();
            $table->string('cta_link', 255)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('banner_product', function (Blueprint $table) {
            $table->uuid('banner_id');
            $table->uuid('product_id');

            $table->foreign('banner_id')
                ->references('id')->on('banners')
                ->cascadeOnDelete();

            $table->foreign('product_id')
                ->references('id')->on('products')
                ->cascadeOnDelete();

            $table->primary(['banner_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
        Schema::dropIfExists('banner_product');
    }
};
