<?php

namespace App\Services\Admin;

use App\Models\ProductReview;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductReviewService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'rating',
            'title',
            'created_at',
            'is_published',
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return ProductReview::query()

            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when(isset($params['is_published']), function ($q) use ($params) {
                $q->where('is_published', $params['is_published']);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function update(ProductReview $productReview, array $data): bool
    {
        return $productReview->update($data);
    }

    public function delete(ProductReview $productReview): ?bool
    {
        return $productReview->delete();
    }
}
