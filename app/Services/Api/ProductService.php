<?php

namespace App\Services\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductReviewResource;

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
                'variants.attributes'
            ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
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
    public function show(string $id)
    {
        $product = Product::with([
            'category',
            'images',
            'reviews.user',
            'variants' => function ($query) {
                $query->where('price', '>', 0);
            },
            'variants.attributes'
        ])->findOrFail($id);

        return [
            'item' => new ProductResource($product),

            // reviews sebagai resource
            'reviews' => ProductReviewResource::collection($product->reviews()->where('is_published', true)->latest()->get()),

            // simple stats
            'review_stats' => [
                'count' => $product->reviews()->count(),
                'avg' => round($product->reviews()->avg('rating'), 1),
            ],
        ];
    }
}
