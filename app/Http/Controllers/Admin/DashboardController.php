<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Top Metrics
        // Total Pendapatan (Hanya order yang sudah dibayar/selesai)
        $totalRevenue = Order::whereIn('payment_status', ['paid', 'settlement', 'capture'])->sum('grand_total');

        $totalOrders = Order::count();
        $totalUsers = User::count();

        // Menghitung Pesanan Custom (Order yang memiliki item dengan customization_id)
        $customOrdersCount = Order::whereHas('items', function ($query) {
            $query->whereNotNull('customization_id');
        })->count();

        // 2. Pesanan Terbaru (Untuk Tabel)
        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {
                // Cek apakah order ini custom atau retail
                $isCustom = $order->items->contains(fn ($item) => ! is_null($item->customization_id));

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'name' => $order->user->name ?? 'Unknown',
                    'email' => $order->user->email ?? '-',
                    'avatar' => $order->user->avatar,
                    // Ambil nama produk pertama, jika > 1 tambahkan label "+ X lainnya"
                    'product' => $order->items->count() > 1
                        ? $order->items->first()->product_name.' (+'.($order->items->count() - 1).' lainnya)'
                        : ($order->items->first()?->product_name ?? '-'),
                    'type' => $isCustom ? 'Custom' : 'Retail',
                    'total' => $order->grand_total,
                    'status' => $order->order_status,
                ];
            });

        // 3. Produk Terlaris (Menggantikan Kategori karena Kategori tidak langsung nempel di OrderItem)
        $topProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->take(4)
            ->get()
            ->map(function ($item) use ($totalOrders) {
                // Simulasi persentase sederhana
                $percent = $totalOrders > 0 ? round(($item->total_sold / OrderItem::sum('quantity')) * 100) : 0;

                return [
                    'name' => $item->product_name,
                    'count' => $item->total_sold,
                    'percent' => $percent.'%',
                ];
            });

        return Inertia::render('dashboard', [
            'metrics' => [
                'revenue' => (float) $totalRevenue,
                'orders' => $totalOrders,
                'custom_orders' => $customOrdersCount,
                'users' => $totalUsers,
            ],
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
        ]);
    }
}
