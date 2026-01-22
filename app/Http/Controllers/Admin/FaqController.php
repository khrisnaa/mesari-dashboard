<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Helpers\FlashHelper;
use App\Http\Requests\Faq\Admin\StoreFaqRequest;
use App\Http\Requests\Faq\Admin\UpdateFaqRequest;
use App\Models\Faq;
use App\Services\Admin\FaqService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FaqController extends Controller
{
    public function __construct(
        protected FaqService $faqService
    ) {}

    // fetch faqs
    public function index(Request $request)
    {
        $faqs = $this->faqService->paginate($request->all());

        return Inertia::render('faqs/index', [
            'faqs' => $faqs,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    // store faq
    public function store(StoreFaqRequest $request)
    {
        $this->faqService->store($request->validated());

        return redirect()->route('faqs.index')
            ->with('success', FlashHelper::stamp('FAQ successfully created.'));
    }

    // update faq
    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $this->faqService->update($faq, $request->validated());

        return redirect()->route('faqs.index')
            ->with('success', FlashHelper::stamp('FAQ successfully updated.'));
    }

    // delete faq
    public function destroy(Faq $faq)
    {
        $this->faqService->delete($faq);

        return redirect()->route('faqs.index')
            ->with('success', FlashHelper::stamp('FAQ successfully deleted.'));
    }
}
