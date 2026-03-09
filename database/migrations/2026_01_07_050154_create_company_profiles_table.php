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
            $table->string('company_name', 100);
            $table->string('tagline', 150)->nullable();
            $table->text('description')->nullable();
            $table->string('email', 50);
            $table->string('phone', 20);
            $table->string('whatsapp', 20);
            $table->text('address');
            $table->string('province_name', 100)->nullable();
            $table->string('city_name', 100)->nullable();
            $table->string('district_name', 100)->nullable();
            $table->string('subdistrict_name', 100)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->unsignedBigInteger('origin_id')->nullable();
            $table->string('google_map_url', 255)->nullable();
            $table->string('working_hours', 100)->nullable();
            $table->string('instagram', 100)->nullable();
            $table->string('tiktok', 100)->nullable();
            $table->string('facebook', 100)->nullable();
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
