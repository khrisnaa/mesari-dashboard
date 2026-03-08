<?php

namespace App\Services\Api;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductService
{
    public function paginate(Request $request)
    {
        $perPage = $request->integer('per_page', 12);

        $query = Product::query()
            ->where('is_published', true)
            ->with([
                'category',
                'images',
                'variants' => function ($q) {
                    $q->where('price', '>', 0);
                },
                'variants.attributes',
            ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('category')) {
            $slug = $request->category;

            $query->whereHas('category', function ($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        if ($request->filled('products')) {

            $slugs = explode(',', $request->products);

            $query->whereIn('slug', $slugs);
        }

        if ($request->filled('is_customizable')) {
            $query->where('is_customizable', $request->boolean('is_customizable'));
        }

        if ($request->filled('min_price') || $request->filled('max_price')) {
            $min = $request->min_price;
            $max = $request->max_price;

            $query->whereHas('variants', function ($q) use ($min, $max) {
                if ($min !== null) {
                    $q->where('price', '>=', $min);
                }

                if ($max !== null) {
                    $q->where('price', '<=', $max);
                }
            });
        }

        $sort = $request->get('sort', 'newest');

        match ($sort) {
            'price_asc' => $query->withMin('variants', 'price')->orderBy('variants_min_price'),

            'price_desc' => $query->withMin('variants', 'price')->orderByDesc('variants_min_price'),

            default => $query->latest(),
        };

        $products = $query->paginate($perPage);

        return $products;
    }

    // get product detail
    public function show(string $slug)
    {
        $product = Product::with([
            'category',
            'images',
            'reviews' => function ($query) {
                $query->where('is_published', true);
            },
            'variants' => function ($query) {
                $query->where('price', '>', 0)
                    ->orderBy('price', 'asc');
            },
            'variants.attributes',
        ])
            ->withCount(['reviews' => function ($query) {
                $query->where('is_published', true);
            }])
            ->withAvg(['reviews' => function ($query) {
                $query->where('is_published', true);
            }], 'rating')
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProductResource($product);
    }

    public function getReviews(string $slug, int $perPage = 10)
    {
        $product = Product::where('slug', $slug)->firstOrFail(['id']);

        $reviews = ProductReview::with([
            'orderItem',
            'orderItem.order.user',
            'orderItem.variant.product',
        ])
            ->where('product_id', $product->id)
            ->where('is_published', true)
            ->latest()
            ->paginate($perPage);

        $reviewsCount = ProductReview::where('product_id', $product->id)
            ->where('is_published', true)
            ->count();
        $reviewsAvg = ProductReview::where('product_id', $product->id)
            ->where('is_published', true)
            ->avg('rating');

        return [
            'reviews' => $reviews,
            'stats' => [
                'count' => $reviewsCount,
                'avg' => round($reviewsAvg ?? 0, 1),
            ],
        ];
    }

    public function getHighlighted()
    {
        return Product::query()
            ->where('is_published', true)
            ->where('is_highlighted', true)
            ->where('is_customizable', false)
            ->with([
                'category',
                'images',
                'variants' => function ($q) {
                    $q->where('price', '>', 0);
                },
                'variants.attributes',
            ])
            ->latest()
            ->get();
    }
}
