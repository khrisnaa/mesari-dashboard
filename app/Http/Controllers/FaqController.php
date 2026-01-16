<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Faq\CreateFaqRequest;
use App\Http\Requests\Faq\UpdateFaqRequest;
use App\Models\Faq;
use App\Services\FaqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function __construct(
        protected FaqService $faqService
    ) {}


    public function index(Request $request)
    {
        $faqs = $this->faqService->paginate($request->all());

        return Inertia::render('faqs/index', [
            'faqs' => $faqs,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('faqs/create');
    }

    public function store(CreateFaqRequest $request)
    {
        $this->faqService->store($request->validated());

        return redirect()->route('faqs.index')
            ->with('success', FlashHelper::stamp('FAQ successfully created.'));
    }

    public function edit(Faq $faq)
    {
        return Inertia::render('faqs/edit', [
            'faq' => $faq,
        ]);
    }

    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $this->faqService->update($faq, $request->validated());

        return redirect()->route('faqs.index')
            ->with('success', FlashHelper::stamp('FAQ successfully updated.'));
    }

    public function destroy(Faq $faq)
    {
        $this->faqService->delete($faq);

        return redirect()->route('faqs.index')
            ->with('success', FlashHelper::stamp('FAQ successfully deleted.'));
    }
}
