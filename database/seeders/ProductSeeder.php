<?php

namespace Database\Seeders;

use App\Enums\VariantAttributeType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\VariantAttribute;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categoriesJson = json_decode(file_get_contents(database_path('data/categories.json')), true);
        $sizesJson = json_decode(file_get_contents(database_path('data/variant_attributes_sizes.json')), true);
        $colorsJson = json_decode(file_get_contents(database_path('data/variant_attributes_colors.json')), true);
        $productsJson = json_decode(file_get_contents(database_path('data/products.json')), true);

        $categoriesMap = [];

        foreach ($categoriesJson as $item) {
            $category = Category::create([
                'id' => Str::uuid(),
                'name' => $item['name'],
                'slug' => $item['slug'],
            ]);

            $categoriesMap[$item['name']] = $category->id;
        }

        $sizesMap = [];
        foreach ($sizesJson as $item) {
            $attr = VariantAttribute::create([
                'id' => Str::uuid(),
                'name' => $item['name'],
                'hex' => $item['hex'],
                'type' => $item['type'],
            ]);

            $sizesMap[$item['name']] = $attr->id;
        }

        $colorsMap = [];
        foreach ($colorsJson as $item) {
            $attr = VariantAttribute::create([
                'id' => Str::uuid(),
                'name' => $item['name'],
                'hex' => $item['hex'],
                'type' => $item['type'],
            ]);

            $colorsMap[$item['name']] = $attr->id;
        }

        foreach ($productsJson as $item) {
            $product = Product::create([
                'id' => Str::uuid(),
                'category_id' => $categoriesMap[$item['category']],
                'name' => $item['name'],
                'slug' => $item['slug'],
                'description' => $item['description'],
                'weight' => 500,
                'is_published' => true,
                'is_customizable' => false,
                'custom_additional_price' => null,
                'discount_type' => null,
                'discount_value' => null,
            ]);

            ProductImage::create([
                'id' => Str::uuid(),
                'product_id' => $product->id,
                'path' => $item['thumbnail'],
                'type' => 'thumbnail',
                'sort_order' => 0,
            ]);

            foreach ($item['gallery'] as $index => $imgPath) {
                ProductImage::create([
                    'id' => Str::uuid(),
                    'product_id' => $product->id,
                    'path' => $imgPath,
                    'type' => 'gallery',
                    'sort_order' => $index + 1,
                ]);
            }

            foreach ($item['colors'] as $colorName) {
                foreach ($item['sizes'] as $sizeName) {
                    $variant = ProductVariant::create([
                        'id' => Str::uuid(),
                        'product_id' => $product->id,
                        'price' => $item['price'],
                        'stock' => rand(10, 50),
                    ]);

                    DB::table('product_variant_attribute')->insert([
                        [
                            'product_variant_id' => $variant->id,
                            'variant_attribute_id' => $colorsMap[$colorName],
                        ],
                        [
                            'product_variant_id' => $variant->id,
                            'variant_attribute_id' => $sizesMap[$sizeName],
                        ],
                    ]);
                }
            }
        }
    }

    public function test(): void
    {
        $categories = Category::factory()->count(5)->create();

        $products = Product::factory()
            ->count(10)
            ->make()
            ->each(function ($product) use ($categories) {
                $product->category_id = $categories->random()->id;
                $product->save();
            });

        $variants = ProductVariant::factory()
            ->count(30)
            ->make()
            ->each(function ($variant) use ($products) {
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
    }
}
