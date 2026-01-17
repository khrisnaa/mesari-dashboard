<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Testimonial\UpdateTestimonialRequest;
use App\Models\Testimonial;
use App\Services\TestimonialService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function __construct(
        protected TestimonialService $testimonialService
    ) {}

    // fetch testimonials
    public function index(Request $request)
    {
        $testimonials = $this->testimonialService->paginate($request->all());

        return Inertia::render('testimonials/index', [
            'testimonials' => $testimonials,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    // store testimonial
    public function store(StoreTestimonialRequest $request)
    {
        $this->testimonialService->store($request->validated());

        return redirect()->route('testimonials.index')
            ->with('success', FlashHelper::stamp('Testimonial successfully created.'));
    }

    // update testimonial
    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        $this->testimonialService->update($testimonial, $request->validated());

        return redirect()->route('testimonials.index')
            ->with('success', FlashHelper::stamp('Testimonial successfully updated.'));
    }

    // delete testimonial
    public function destroy(Testimonial $testimonial)
    {
        $this->testimonialService->delete($testimonial);

        return redirect()->route('testimonials.index')
            ->with('success', FlashHelper::stamp('Testimonial successfully deleted.'));
    }
}
