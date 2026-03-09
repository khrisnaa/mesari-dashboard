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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('ro_subdistrict_id')->index();
            $table->string('recipient_name', 100);
            $table->string('phone', 20);
            $table->string('label', 50);
            $table->text('address_line');
            $table->string('province_name', 100);
            $table->string('city_name', 100);
            $table->string('district_name', 100);
            $table->string('subdistrict_name', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
