<?php

namespace App\Services\Admin;

use App\Models\Faq;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FaqService
{
    // paginate faqs with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'question',
            'created_at',
            'sort_order',
            'is_published',
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Faq::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            })
            ->when(isset($params['is_published']), function ($q) use ($params) {
                $q->where('is_published', $params['is_published']);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    // store a new faq
    public function store(array $data): Faq
    {
        return Faq::create($data);
    }

    // update a faq
    public function update(Faq $faq, array $data): bool
    {
        return $faq->update($data);
    }

    // delete a faq
    public function delete(Faq $faq): bool|null
    {
        return $faq->delete();
    }
}
