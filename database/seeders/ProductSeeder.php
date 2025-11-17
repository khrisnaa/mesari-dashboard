<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Men' => ['T-Shirt', 'Jeans', 'Shoes'],
            'Women' => ['T-Shirt', 'Skirt', 'Heels'],
        ];

        $categoryModels = [];

        foreach ($categories as $parentName => $childNames) {
            $parent = Category::create([
                'id' => Str::uuid(),
                'name' => $parentName,
                'slug' => strtolower($parentName),
                'description' => $parentName . ' clothing and accessories',
                'parent_id' => null,
            ]);

            foreach ($childNames as $childName) {
                $child = Category::create([
                    'id' => Str::uuid(),
                    'name' => $childName,
                    'slug' => strtolower($childName) . '-' . strtolower($parentName),
                    'description' => $parentName . ' ' . $childName,
                    'parent_id' => $parent->id,
                ]);

                $categoryModels[$parentName][$childName] = $child;
            }
        }

        $productsData = [
            'Men' => [
                'T-Shirt' => [
                    ['Classic White Tee', 'White', 'M', 120000],
                    ['Graphic Black Tee', 'Black', 'L', 150000],
                    ['Striped Polo Shirt', 'Blue', 'M', 180000],
                    ['V-Neck Tee', 'Grey', 'S', 130000],
                    ['Long Sleeve Tee', 'White', 'L', 160000],
                    ['Slim Fit Tee', 'Red', 'M', 170000],
                    ['Basic Navy Tee', 'Blue', 'S', 140000],
                    ['Pocket Tee', 'Green', 'M', 150000],
                    ['Henley Shirt', 'Beige', 'L', 190000],
                    ['Retro Graphic Tee', 'Black', 'M', 200000],
                ],
                'Jeans' => [
                    ['Slim Fit Jeans', 'Blue', '32', 250000],
                    ['Regular Fit Jeans', 'Black', '34', 240000],
                    ['Straight Cut Jeans', 'Blue', '32', 260000],
                    ['Distressed Jeans', 'Blue', '34', 280000],
                    ['Skinny Jeans', 'Black', '30', 270000],
                    ['Classic Denim', 'Blue', '32', 230000],
                    ['Relaxed Fit Jeans', 'Grey', '36', 220000],
                    ['Cuffed Jeans', 'Blue', '32', 250000],
                    ['Ripped Jeans', 'Black', '34', 290000],
                    ['Dark Wash Jeans', 'Blue', '32', 260000],
                ],
                'Shoes' => [
                    ['Running Sneakers', 'White', '42', 450000],
                    ['Leather Boots', 'Brown', '43', 550000],
                    ['Casual Loafers', 'Black', '41', 500000],
                    ['Canvas Sneakers', 'Red', '42', 400000],
                    ['High Top Sneakers', 'Black', '43', 470000],
                    ['Slip-On Shoes', 'Blue', '42', 420000],
                    ['Oxford Shoes', 'Brown', '41', 520000],
                    ['Sandals', 'Black', '42', 350000],
                    ['Sports Trainers', 'White', '43', 480000],
                    ['Chukka Boots', 'Tan', '42', 530000],
                ],
            ],
            'Women' => [
                'T-Shirt' => [
                    ['Floral Tee', 'Pink', 'S', 130000],
                    ['Casual Black Tee', 'Black', 'M', 120000],
                    ['Striped Tee', 'White', 'S', 140000],
                    ['V-Neck Tee', 'Blue', 'M', 150000],
                    ['Graphic Tee', 'Grey', 'S', 160000],
                    ['Slim Fit Tee', 'Red', 'M', 170000],
                    ['Crop Tee', 'White', 'S', 150000],
                    ['Pocket Tee', 'Beige', 'M', 160000],
                    ['Retro Graphic Tee', 'Black', 'M', 180000],
                    ['Basic Tee', 'Blue', 'S', 140000],
                ],
                'Skirt' => [
                    ['Denim Skirt', 'Blue', 'M', 180000],
                    ['Pleated Skirt', 'Red', 'L', 200000],
                    ['A-Line Skirt', 'Black', 'M', 190000],
                    ['Mini Skirt', 'White', 'S', 170000],
                    ['Maxi Skirt', 'Beige', 'L', 220000],
                    ['Wrap Skirt', 'Pink', 'M', 210000],
                    ['Pencil Skirt', 'Black', 'S', 200000],
                    ['Tulle Skirt', 'Blue', 'M', 230000],
                    ['Layered Skirt', 'Grey', 'M', 190000],
                    ['Flared Skirt', 'Red', 'L', 220000],
                ],
                'Heels' => [
                    ['Classic Pumps', 'Black', '38', 450000],
                    ['Stiletto Heels', 'Red', '39', 500000],
                    ['Block Heels', 'Beige', '38', 470000],
                    ['Kitten Heels', 'Blue', '37', 420000],
                    ['Peep Toe Heels', 'Black', '38', 480000],
                    ['Strappy Heels', 'Gold', '39', 550000],
                    ['Ankle Strap Heels', 'Pink', '38', 500000],
                    ['Pointed Toe Heels', 'Red', '37', 520000],
                    ['Wedge Heels', 'Brown', '38', 450000],
                    ['Slingback Heels', 'Black', '39', 470000],
                ],
            ],
        ];

        foreach ($productsData as $parentName => $childCategories) {
            foreach ($childCategories as $childName => $products) {
                $category = Category::where('slug', strtolower($childName) . '-' . strtolower($parentName))->first();

                foreach ($products as $product) {
                    $slug = Str::slug($product[0]);
                    $originalSlug = $slug;
                    $counter = 1;

                    while (Product::where('slug', $slug)->exists()) {
                        $slug = $originalSlug . '-' . $counter;
                        $counter++;
                    }

                    Product::create([
                        'id' => Str::uuid(),
                        'name' => $product[0],
                        'slug' => $slug,
                        'description' => $product[0],
                        'price' => $product[3],
                        'size' => $product[2],
                        'color' => $product[1],
                        'stock' => rand(20, 50),
                        'category_id' => $category->id,
                    ]);
                }
            }
        }
    }
}
