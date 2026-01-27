<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Helpers\FlashHelper;
use App\Http\Requests\Admin\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Admin\Testimonial\UpdateTestimonialRequest;
use App\Models\Testimonial;
use App\Services\Admin\TestimonialService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function __construct(
        protected TestimonialService $testimonialService
    ) {}

    public function index(Request $request)
    {
        $testimonials = $this->testimonialService->paginate($request->all());

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function store(StoreTestimonialRequest $request)
    {
        $this->testimonialService->store($request->validated());

        return redirect()->route('testimonials.index')
            ->with('success', FlashHelper::stamp('Testimonial successfully created.'));
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        $this->testimonialService->update($testimonial, $request->validated());

        return redirect()->route('testimonials.index')
            ->with('success', FlashHelper::stamp('Testimonial successfully updated.'));
    }

    public function destroy(Testimonial $testimonial)
    {
        $this->testimonialService->delete($testimonial);

        return redirect()->route('testimonials.index')
            ->with('success', FlashHelper::stamp('Testimonial successfully deleted.'));
    }
}
