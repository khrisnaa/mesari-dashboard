<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Helpers\FlashHelper;
use App\Http\Requests\Admin\Category\StoreCategoryRequest;
use App\Http\Requests\Admin\Category\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\Admin\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    public function index(Request $request)
    {
        $categories = $this->categoryService->paginate($request->all());

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->store($request->validated());

        $message = $category->wasRecentlyCreated ? 'Category  successfully created.' : 'Category successfully restored.';

        return redirect()->back()
            ->with('success', FlashHelper::stamp($message));
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->categoryService->update($category, $request->validated());

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category successfully updated.'));
    }

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
