<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Services\Api\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    public function index()
    {
        $cart = $this->cartService->getCart(Auth::id());

        return ApiResponse::success(
            'Cart fetched successfully',
            new CartResource($cart)
        );
    }

    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => ['required'],
            'product_variant_id' => ['required'],
            'price' => ['required', 'numeric'],
            'quantity' => ['required', 'numeric', 'min:1'],
        ]);

        $cart = $this->cartService->getCart(Auth::id());

        $item = $this->cartService->addItem($cart, $request->all());

        return ApiResponse::success(
            'Item added to cart',
            new CartResource($cart)
        );
    }

    public function updateItem(Request $request, string $itemId)
    {
        $request->validate([
            'quantity' => ['required', 'numeric', 'min:1']
        ]);

        $item = CartItem::findOrFail($itemId);

        $this->cartService->updateItem($item, $request->quantity);

        return ApiResponse::success('Cart item updated');
    }

    public function deleteItem(string $itemId)
    {
        $item = CartItem::findOrFail($itemId);

        $this->cartService->deleteItem($item);

        return ApiResponse::success('Cart item removed');
    }
}
