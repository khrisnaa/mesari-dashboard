<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Http\Resources\CartResource;
use App\Services\Api\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(
        protected CartService $cartService
    ) {}

    public function index(Request $request)
    {
        $cart = $this->cartService->getCart($request->user()->id);

        $cart->load([
            'items.variant.product.images',
            'items.variant.attributes',
        ]);

        return ApiResponse::success(
            'Cart fetched successfully',
            new CartResource($cart)
        );
    }

    // create cart item
    public function addItem(Request $request)
    {
        $request->validate([
            'product_variant_id' => ['required', 'uuid', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->cartService->getCart($request->user()->id);

        $result = $this->cartService->addItem($cart, $request->only([
            'product_variant_id',
            'quantity',
        ]));

        // $cart->load([
        //     'items.variant.product.images',
        //     'items.variant.attributes',
        // ]);

        $result->load([
            'variant.product.images',
            'variant.attributes',
        ]);

        return ApiResponse::success(
            'Item added to cart',
            new CartItemResource($result)
        );
    }

    // update amount of quantity in cart item
    public function updateItem(Request $request, string $itemId)
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->cartService->getCart($request->user()->id);

        $item = $cart->items()
            ->where('id', $itemId)
            ->firstOrFail();

        $result = $this->cartService->updateItem($item, $request->quantity);

        $result->load([
            'variant.product.images',
            'variant.attributes',
        ]);

        return ApiResponse::success(
            'Cart item updated',
            new CartItemResource($result)
        );
    }

    // remove cart item
    public function deleteItem(string $itemId, Request $request)
    {
        $cart = $this->cartService->getCart($request->user()->id);

        $item = $cart->items()
            ->where('id', $itemId)
            ->firstOrFail();

        $this->cartService->deleteItem($item);

        // $cart->load([
        //     'items.variant.product.images',
        //     'items.variant.attributes',
        // ]);

        return ApiResponse::success(
            'Cart item removed',
        );
    }
}
