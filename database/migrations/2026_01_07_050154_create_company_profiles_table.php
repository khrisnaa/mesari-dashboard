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
        Schema::create('company_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('company_name');
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->string('whatsapp');
            $table->string('address');

            $table->string('province_name')->nullable();
            $table->string('city_name')->nullable();
            $table->string('district_name')->nullable();
            $table->string('subdistrict_name')->nullable();
            $table->string('postal_code')->nullable();

            $table->unsignedBigInteger('origin_id')->nullable();

            $table->string('google_map_url')->nullable();
            $table->string('working_hours')->nullable();
            $table->string('instagram')->nullable();
            $table->string('tiktok')->nullable();
            $table->string('facebook')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_profiles');
    }
};
