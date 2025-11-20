<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'asc' ? 'asc' : 'desc';

        $categories = Category::query()
            ->with('parent')
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($sort, function ($q) use ($sort, $direction) {
                $q->orderBy($sort, $direction);
            }, function ($q) {
                // Default sorting
                $q->orderBy('created_at', 'desc');
            })
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        return Inertia::render('categories/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);

        $existing = Category::onlyTrashed()
            ->where('name', $data['name'])
            ->first();

        if ($existing) {
            $existing->restore();

            $existing->update($data);

            return redirect()
                ->route('categories.index')
                ->with('success', FlashHelper::stamp('Category restored successfully.'));
        }

        Category::create($data);

        return redirect()
            ->route('categories.index')
            ->with('success', FlashHelper::stamp('Category created successfully.'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $categories = Category::all();
        return Inertia::render('categories/edit', [
            'category' => $category,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('categories.index')
            ->with('success',  FlashHelper::stamp('Category updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return redirect()->back()->with('error',  FlashHelper::stamp('Cannot delete category that has products.'));
        }

        $category->delete();

        return redirect()->back()->with('success',  FlashHelper::stamp('Category deleted successfully.'));
    }
}
