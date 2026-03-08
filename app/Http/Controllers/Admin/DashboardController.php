<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $thisMonthStart = Carbon::now()->startOfMonth();
        $lastMonthStart = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        $calculateTrend = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100 : 0;
            }

            return round((($current - $previous) / $previous) * 100, 1);
        };

        // --- REVENUE ---
        $totalRevenue = Order::whereIn('payment_status', ['paid', 'settlement', 'capture'])->sum('grand_total');
        $thisMonthRevenue = Order::whereIn('payment_status', ['paid', 'settlement', 'capture'])->where('created_at', '>=', $thisMonthStart)->sum('grand_total');
        $lastMonthRevenue = Order::whereIn('payment_status', ['paid', 'settlement', 'capture'])->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->sum('grand_total');
        $revenueTrend = $calculateTrend($thisMonthRevenue, $lastMonthRevenue);

        // --- ORDERS ---
        $totalOrders = Order::count();
        $thisMonthOrders = Order::where('created_at', '>=', $thisMonthStart)->count();
        $lastMonthOrders = Order::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
        $ordersTrend = $calculateTrend($thisMonthOrders, $lastMonthOrders);

        // --- USERS ---
        $totalUsers = User::withoutRole(['admin', 'superadmin'])->count();
        $thisMonthUsers = User::withoutRole(['admin', 'superadmin'])->where('created_at', '>=', $thisMonthStart)->count();
        $lastMonthUsers = User::withoutRole(['admin', 'superadmin'])->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();
        $usersTrend = $calculateTrend($thisMonthUsers, $lastMonthUsers);

        // --- CUSTOM ORDERS ---
        $customOrdersCount = Order::whereHas('items', function ($query) {
            $query->whereNotNull('customization_id');
        })->count();
        $customTrend = 0;

        $recentOrders = Order::with(['user', 'items'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($order) {

                $isCustom = $order->items->contains(fn ($item) => ! is_null($item->customization_id));

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'name' => $order->user->name ?? 'Unknown',
                    'email' => $order->user->email ?? '-',
                    'avatar' => $order->user->avatar,
                    'product' => $order->items->count() > 1
                        ? $order->items->first()->product_name.' (+'.($order->items->count() - 1).' lainnya)'
                        : ($order->items->first()?->product_name ?? '-'),
                    'type' => $isCustom ? 'Custom' : 'Retail',
                    'total' => $order->grand_total,
                    'status' => $order->order_status,
                ];
            });

        $topProducts = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->take(4)
            ->get()
            ->map(function ($item) use ($totalOrders) {

                $percent = $totalOrders > 0 ? round(($item->total_sold / OrderItem::sum('quantity')) * 100) : 0;

                return [
                    'name' => $item->product_name,
                    'count' => $item->total_sold,
                    'percent' => $percent.'%',
                ];
            });

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $dailyStats = Order::whereIn('payment_status', ['paid', 'settlement', 'capture'])
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(grand_total) as revenue'),
                DB::raw('COUNT(id) as orders')
            )
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $chartData = [];
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        for ($i = 0; $i < 7; $i++) {
            $dateString = $startOfWeek->copy()->addDays($i)->format('Y-m-d');
            $stat = $dailyStats->get($dateString);

            $chartData[] = [
                'day' => $days[$i],
                'revenue' => $stat ? (float) $stat->revenue : 0,
                'orders' => $stat ? (int) $stat->orders : 0,
            ];
        }

        return Inertia::render('dashboard', [
            'metrics' => [
                'revenue' => (float) $totalRevenue,
                'revenue_trend' => $revenueTrend,
                'orders' => $totalOrders,
                'orders_trend' => $ordersTrend,
                'custom_orders' => $customOrdersCount,
                'custom_trend' => $customTrend,
                'users' => $totalUsers,
                'users_trend' => $usersTrend,
            ],
            'chart_data' => $chartData,
            'recent_orders' => $recentOrders,
            'top_products' => $topProducts,
        ]);
    }
}
