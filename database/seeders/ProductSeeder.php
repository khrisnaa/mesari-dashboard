<?php

namespace Database\Seeders;

use App\Enums\VariantAttributeType;
use App\Models\VariantAttribute;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDiscount;
use App\Models\ProductVariant;
use Database\Factories\ProductDiscountFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::factory()->count(5)->create();

        $products = Product::factory()->count(10)->make()->each(function ($product) use ($categories) {
            $product->category_id = $categories->random()->id;
            $product->save();
        });

        $variants = ProductVariant::factory()->count(30)->make()->each(function ($variant) use ($products) {
            $variant->product_id = $products->random()->id;
            $variant->save();
        });

        $sizes = VariantAttribute::where('type', VariantAttributeType::SIZE->value)->get();
        $colors = VariantAttribute::where('type', VariantAttributeType::COLOR->value)->get();

        $variants->each(function ($variant) use ($sizes, $colors) {
            $size = $sizes->random(1)->pluck('id')->toArray();
            $colorCount = rand(0, min(2, $colors->count()));
            $selectedColors = $colorCount > 0 ? $colors->random($colorCount)->pluck('id')->toArray() : [];
            $selectedAttributes = array_merge($size, $selectedColors);
            $variant->attributes()->sync($selectedAttributes);
        });


        ProductDiscount::factory()->count(5)->make()->each(function ($discount) use ($products) {
            $discount->product_id = $products->random()->id;
            $discount->save();
        });
    }
}
