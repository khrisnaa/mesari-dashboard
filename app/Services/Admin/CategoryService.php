<?php

namespace App\Services\Admin;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    // paginate categories with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'name',
            'created_at'
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Category::query()
            ->when($params['search'] ?? null, fn($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    // store a category
    public function store(array $data): Category
    {
        $data['slug'] = Str::slug($data['name']);

        // find a category by name, including soft-deleted ones
        $existing = Category::onlyTrashed()
            ->where('name', $data['name'])
            ->first();

        if ($existing) {
            $existing->restore();
            $existing->update($data);
            return $existing;
        }

        return Category::create($data);
    }

    // update a category
    public function update(Category $category, array $data): bool
    {
        $data['slug'] = Str::slug($data['name']);

        $exists = Category::where('slug', $data['slug'])
            ->where('id', '!=', $category->id)
            ->exists();

        if ($exists) {
            $data['slug'] .= '-' . uniqid();
        }

        return $category->update($data);
    }

    // delete a category
    public function delete(Category $category): bool
    {
        if ($category->products()->exists()) {
            return false;
        }

        return $category->delete();
    }
}
