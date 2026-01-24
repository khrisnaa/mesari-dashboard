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
        $perPage = $request->get('per_page', 12);

        $query = Product::with([
            'category',
            'variants.attributes',
            'images',
            'discount',
        ]);

        // search
        if ($search = $request->get('search')) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        // filter by category
        if ($categoryId = $request->get('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // price filter
        if ($minPrice = $request->get('min_price')) {
            $query->whereHas('variants', fn($q) => $q->where('price', '>=', $minPrice));
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->whereHas('variants', fn($q) => $q->where('price', '<=', $maxPrice));
        }

        // sorting
        $sort = $request->get('sort', 'newest');
        match ($sort) {
            'price_asc'  => $query->withMin('variants', 'price')->orderBy('variants_min_price'),
            'price_desc' => $query->withMin('variants', 'price')->orderByDesc('variants_min_price'),
            default       => $query->orderBy('created_at', 'desc'),
        };

        // pgination
        $products = $query->paginate($perPage);

        return [
            'items' => ProductResource::collection($products),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
                'has_more'     => $products->hasMorePages(),
            ]
        ];
    }

    public function show(string $id)
    {
        $product = Product::with([
            'category',
            'variants.attributes',
            'images',
            'discount',
            'reviews.user', // include user
        ])->findOrFail($id);

        return [
            'item' => new ProductResource($product),

            // reviews sebagai resource
            'reviews' => ProductReviewResource::collection(
                $product->reviews()->where('is_published', true)->latest()->get()
            ),

            // simple stats
            'review_stats' => [
                'count'  => $product->reviews()->count(),
                'avg'    => round($product->reviews()->avg('rating'), 1),
            ],
        ];
    }
}
