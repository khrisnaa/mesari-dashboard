<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Helpers\FlashHelper;
use App\Http\Requests\Admin\Faq\StoreFaqRequest;
use App\Http\Requests\Admin\Faq\UpdateFaqRequest;
use App\Models\Faq;
use App\Services\Admin\FaqService;
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

    public function store(StoreFaqRequest $request)
    {
        $this->faqService->store($request->validated());

        return redirect()->back()
            ->with('success', FlashHelper::stamp('FAQ successfully created.'));
    }

    public function update(UpdateFaqRequest $request, Faq $faq)
    {
        $this->faqService->update($faq, $request->validated());

        return redirect()->back()
            ->with('success', FlashHelper::stamp('FAQ successfully updated.'));
    }

    public function destroy(Faq $faq)
    {
        $this->faqService->delete($faq);

        return redirect()->back()
            ->with('success', FlashHelper::stamp('FAQ successfully deleted.'));
    }
}
