<?php

namespace App\Http\Controllers;

use App\Models\Product;
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

        $products = Product::query()
            ->with(['category', 'variants.attributes'])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($request->sort, function ($q) use ($request) {
                $direction = $request->direction === 'asc' ? 'asc' : 'desc';
                $q->orderBy($request->sort, $direction)
                    ->orderBy('id');
            }, function ($q) {
                $q->orderBy('created_at', 'desc')
                    ->orderBy('id', 'desc');
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('products/index', [
            'products' => $products,
            'filters'  => $request->only(['search', 'sort', 'direction', 'per_page']),
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
