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

    // display a paginated list of category
    public function index(Request $request)
    {
        $categories = $this->categoryService->paginate($request->all());

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    // show form to create a new category
    public function create()
    {
        return Inertia::render('categories/create', [
            'categories' => Category::all()
        ]);
    }

    // store a new category in the database
    public function store(CreateCategoryRequest $request)
    {
        $category = $this->categoryService->store($request->validated());

        $message = $category->wasRecentlyCreated ? 'Category created successfully.' : 'Category restored successfully.';

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp($message));
    }

    // show form to edit an existing category
    public function edit(Category $category)
    {
        return Inertia::render('categories/edit', ['category' => $category]);
    }

    // update an existing category
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category updated successfully.'));
    }

    // soft delete a category
    public function destroy(Category $category)
    {
        $deleted = $this->categoryService->delete($category);

        if (!$deleted) {
            return redirect()->back()
                ->with('error', FlashHelper::stamp('Cannot delete category that has products.'));
        }

        return redirect()->route('categories.index')
            ->with('success', FlashHelper::stamp('Category deleted successfully.'));
    }

    // store a new category without redirect to categories.index
    public function storeForModal(CreateCategoryRequest $request)
    {
        $this->categoryService->store($request->validated());

        return redirect()->back()
            ->with('success', FlashHelper::stamp('Category created successfully.'));
    }
}
