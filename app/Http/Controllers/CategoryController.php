<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Category\CreateCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}


    public function index(Request $request)
    {
        $categories = $this->categoryService->getPaginatedCategories($request->all());

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }


    public function create()
    {
        return Inertia::render('categories/create', [
            'categories' => Category::all()
        ]);
    }


    public function store(CreateCategoryRequest $request)
    {
        $category = $this->categoryService->upsertCategory($request->validated());

        $message = $category->wasRecentlyCreated ? 'Category created successfully.' : 'Category restored successfully.';

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp($message));
    }


    public function edit(Category $category)
    {
        return Inertia::render('categories/edit', ['category' => $category]);
    }


    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category updated successfully.'));
    }


    public function destroy(Category $category)
    {
        $deleted = $this->categoryService->deleteCategory($category);

        if (!$deleted) {
            return redirect()->back()
                ->with('error', FlashHelper::stamp('Cannot delete category that has products.'));
        }

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category deleted successfully.'));
    }


    public function storeForModal(CreateCategoryRequest $request)
    {
        $this->categoryService->upsertCategory($request->validated());

        return redirect()->back()
            ->with('success', FlashHelper::stamp('Category created successfully.'));
    }
}
