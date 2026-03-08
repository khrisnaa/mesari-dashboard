<?php

namespace Database\Seeders;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductReviewSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/product_reviews.json');

        if (! File::exists($path)) {
            dd('File product_reviews.json not found.');
        }

        $data = json_decode(File::get($path), true);

        foreach ($data as $item) {
            $product = Product::where('slug', $item['product_slug'])->first();

            if (! $product) {
                continue;
            }

            foreach ($item['reviews'] as $review) {
                $user = User::where('email', $review['user_email'])->first();

                if (! $user) {
                    continue;
                }

                $orderItem = OrderItem::whereHas('variant', function ($q) use ($product) {
                    $q->where('product_id', $product->id);
                })
                    ->whereHas('order', function ($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })
                    ->inRandomOrder()
                    ->first();

                if (! $orderItem) {
                    continue;
                }

                ProductReview::create([
                    'id' => Str::uuid(),
                    'product_id' => $product->id,
                    'order_item_id' => $orderItem->id,
                    'rating' => $review['rating'],
                    'title' => $review['title'],
                    'content' => $review['content'],
                    'is_published' => true,
                ]);
            }
        }
    }
}
