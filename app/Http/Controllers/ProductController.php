<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'asc' ? 'asc' : 'desc';

        $products = Product::query()
            ->withSum('variants as total_stock', 'stock')
            ->with(['category', 'variants' => function ($query) {
                $query->with('attributes')->orderBy('price', 'asc');
            }])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($sort === 'stock', function ($q) use ($direction) {
                $q->orderBy('total_stock', $direction);
            })
            ->when($sort === 'price', function ($q) use ($direction) {
                $q->orderBy(
                    ProductVariant::select('price')
                        ->whereColumn('product_id', 'products.id')
                        ->orderBy('price', 'asc')
                        ->limit(1),
                    $direction
                );
            })
            ->when(!in_array($sort, ['price', 'stock']), function ($q) use ($sort, $direction) {
                if ($sort) {
                    $q->orderBy($sort, $direction)->orderBy('id');
                } else {
                    $q->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                }
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
