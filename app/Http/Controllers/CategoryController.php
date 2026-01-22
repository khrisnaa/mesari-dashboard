<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Category\StoreCategoryRequest;
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

    // fetch categories
    public function index(Request $request)
    {
        $categories = $this->categoryService->paginate($request->all());

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    // store category
    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->store($request->validated());

        $message = $category->wasRecentlyCreated ? 'Category  successfully created.' : 'Category successfully restored.';

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp($message));
    }


    // update category
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->categoryService->update($category, $request->validated());

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category successfully updated.'));
    }

    // delete category
    public function destroy(Category $category)
    {
        $deleted = $this->categoryService->delete($category);

        if (!$deleted) {
            return redirect()->back()
                ->with('error', FlashHelper::stamp('Cannot delete category that has products.'));
        }

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category successfully deleted.'));
    }
}
