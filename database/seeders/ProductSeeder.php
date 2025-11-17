<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeType;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // --------------------
        // Categories
        // --------------------
        $categoriesData = [
            'Men' => [
                'description' => 'Men\'s clothing collection',
                'children' => [
                    'T-Shirts' => 'Casual and comfortable t-shirts for men',
                    'Shirts' => 'Formal and casual shirts for men',
                    'Polos' => 'Classic polo shirts for men'
                ]
            ],
            'Women' => [
                'description' => 'Women\'s clothing collection',
                'children' => [
                    'Blouses' => 'Elegant blouses for women',
                    'Tops' => 'Trendy tops for women',
                    'Tank Tops' => 'Comfortable tank tops for women'
                ]
            ]
        ];

        $categoryIds = [];

        foreach ($categoriesData as $parentName => $parentData) {
            $parent = Category::create([
                'id' => $parentId = Str::uuid(),
                'name' => $parentName,
                'slug' => Str::slug($parentName),
                'description' => $parentData['description'],
                'parent_id' => null
            ]);

            $categoryIds[$parentName] = ['id' => $parentId, 'children' => []];

            foreach ($parentData['children'] as $childName => $childDesc) {
                $child = Category::create([
                    'id' => $childId = Str::uuid(),
                    'name' => $childName,
                    'slug' => Str::slug($childName),
                    'description' => $childDesc,
                    'parent_id' => $parentId
                ]);

                $categoryIds[$parentName]['children'][$childName] = $childId;
            }
        }

        // --------------------
        // Attribute Types & Attributes
        // --------------------
        $attributeTypesData = [
            'Size' => [
                ['name' => 'XS', 'hex' => null],
                ['name' => 'S', 'hex' => null],
                ['name' => 'M', 'hex' => null],
                ['name' => 'L', 'hex' => null],
                ['name' => 'XL', 'hex' => null],
                ['name' => 'XXL', 'hex' => null],
            ],
            'Color' => [
                ['name' => 'Red', 'hex' => '#FF0000'],
                ['name' => 'Blue', 'hex' => '#0000FF'],
                ['name' => 'Black', 'hex' => '#000000'],
                ['name' => 'White', 'hex' => '#FFFFFF'],
                ['name' => 'Green', 'hex' => '#00FF00'],
                ['name' => 'Navy', 'hex' => '#000080'],
            ]
        ];

        $attributeIds = [];

        foreach ($attributeTypesData as $typeName => $attributesArray) {
            $type = AttributeType::create([
                'id' => $typeId = Str::uuid(),
                'name' => $typeName
            ]);

            $attributeIds[$typeName] = [];

            foreach ($attributesArray as $attrData) {
                $attr = Attribute::create([
                    'id' => $attrId = Str::uuid(),
                    'name' => $attrData['name'],
                    'hex' => $attrData['hex'],
                    'attribute_type_id' => $typeId
                ]);

                $attributeIds[$typeName][$attrData['name']] = $attrId;
            }
        }

        // --------------------
        // Products Data
        // --------------------
        $productsData = [
            'Men' => [
                'T-Shirts' => [
                    ['name' => 'Classic Cotton Tee', 'description' => 'Soft cotton t-shirt for everyday wear', 'base_price' => 25.99],
                    ['name' => 'V-Neck Essential', 'description' => 'Versatile v-neck t-shirt', 'base_price' => 27.99],
                    ['name' => 'Graphic Print Tee', 'description' => 'Trendy graphic design t-shirt', 'base_price' => 29.99],
                    ['name' => 'Striped Casual Tee', 'description' => 'Classic striped pattern t-shirt', 'base_price' => 28.99],
                ],
                'Shirts' => [
                    ['name' => 'Oxford Button-Down', 'description' => 'Classic oxford shirt for formal occasions', 'base_price' => 49.99],
                    ['name' => 'Slim Fit Dress Shirt', 'description' => 'Modern slim fit dress shirt', 'base_price' => 55.99],
                    ['name' => 'Linen Casual Shirt', 'description' => 'Breathable linen shirt for summer', 'base_price' => 45.99],
                    ['name' => 'Checkered Flannel', 'description' => 'Warm flannel shirt with check pattern', 'base_price' => 42.99],
                    ['name' => 'Denim Chambray Shirt', 'description' => 'Casual denim chambray shirt', 'base_price' => 48.99],
                ],
                'Polos' => [
                    ['name' => 'Classic Pique Polo', 'description' => 'Traditional pique polo shirt', 'base_price' => 39.99],
                    ['name' => 'Performance Golf Polo', 'description' => 'Moisture-wicking polo for sports', 'base_price' => 44.99],
                    ['name' => 'Slim Fit Polo', 'description' => 'Modern slim fit polo shirt', 'base_price' => 41.99],
                ],
            ],
            'Women' => [
                'Blouses' => [
                    ['name' => 'Silk Elegance Blouse', 'description' => 'Luxurious silk blouse for special occasions', 'base_price' => 65.99],
                    ['name' => 'Ruffled Collar Blouse', 'description' => 'Feminine blouse with ruffled details', 'base_price' => 52.99],
                    ['name' => 'Chiffon Flow Blouse', 'description' => 'Light and airy chiffon blouse', 'base_price' => 48.99],
                    ['name' => 'Button-Front Office Blouse', 'description' => 'Professional button-front blouse', 'base_price' => 45.99],
                ],
                'Tops' => [
                    ['name' => 'Crop Jersey Top', 'description' => 'Trendy cropped jersey top', 'base_price' => 32.99],
                    ['name' => 'Wrap Style Top', 'description' => 'Flattering wrap-style top', 'base_price' => 38.99],
                    ['name' => 'Peplum Hem Top', 'description' => 'Stylish peplum hem top', 'base_price' => 42.99],
                    ['name' => 'Off-Shoulder Top', 'description' => 'Fashionable off-shoulder design', 'base_price' => 36.99],
                    ['name' => 'Tunic Length Top', 'description' => 'Comfortable tunic length top', 'base_price' => 40.99],
                ],
                'Tank Tops' => [
                    ['name' => 'Basic Racerback Tank', 'description' => 'Essential racerback tank top', 'base_price' => 22.99],
                    ['name' => 'Loose Fit Tank', 'description' => 'Relaxed loose fit tank top', 'base_price' => 24.99],
                    ['name' => 'Fitted Cami Tank', 'description' => 'Sleek fitted camisole tank', 'base_price' => 26.99],
                    ['name' => 'Athletic Performance Tank', 'description' => 'Moisture-wicking athletic tank', 'base_price' => 28.99],
                ],
            ],
        ];

        // --------------------
        // Create Products & Variants
        // --------------------
        foreach ($productsData as $parentCategory => $childCategories) {
            foreach ($childCategories as $childCategory => $products) {
                foreach ($products as $productData) {
                    $product = Product::create([
                        'id' => $productId = Str::uuid(),
                        'name' => $productData['name'],
                        'slug' => Str::slug($productData['name']),
                        'description' => $productData['description'],
                        'category_id' => $categoryIds[$parentCategory]['children'][$childCategory]
                    ]);

                    // Define variant combinations (Size x Color)
                    $sizes = ['S', 'M', 'L', 'XL'];
                    $colors = ['Red', 'Blue', 'Black', 'White'];

                    foreach ($sizes as $size) {
                        foreach ($colors as $color) {
                            // Add price variation based on size
                            $sizeMultiplier = match ($size) {
                                'S' => 0.95,
                                'M' => 1.0,
                                'L' => 1.05,
                                'XL' => 1.10,
                                default => 1.0
                            };

                            $variantPrice = round($productData['base_price'] * $sizeMultiplier, 2);

                            $variant = ProductVariant::create([
                                'id' => Str::uuid(),
                                'product_id' => $productId,
                                'price' => $variantPrice,
                                'stock' => rand(10, 100)
                            ]);

                            // Attach size and color attributes
                            $variant->attributes()->attach([
                                $attributeIds['Size'][$size],
                                $attributeIds['Color'][$color]
                            ]);
                        }
                    }
                }
            }
        }
    }
}
