<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\FlashHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductReview\UpdateProductReviewRequest;
use App\Models\ProductReview;
use App\Services\Admin\ProductReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductReviewController extends Controller
{
    public function __construct(
        protected ProductReviewService $productReviewService
    ) {}

    public function index(Request $request)
    {
        $reviews = $this->productReviewService->paginate($request->all());

        return Inertia::render('product-reviews/index', [
            'reviews' => $reviews,
        ]);
    }

    public function update(UpdateProductReviewRequest $request, ProductReview $productReview)
    {
        $this->productReviewService->update($productReview, $request->validated());

        return redirect()->back()
            ->with('success', FlashHelper::stamp('Review visibility updated successfully.'));
    }

    public function destroy(ProductReview $productReview)
    {

        $this->productReviewService->delete($productReview);

        return redirect()->back()
            ->with('success', FlashHelper::stamp('Review deleted successfully.'));
    }
}
