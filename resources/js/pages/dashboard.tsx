import { ActionIconButton } from '@/components/buttons/action-icon-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    DollarSign,
    Download,
    Eye,
    Package,
    Scissors,
    ShoppingBag,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';

interface OrderData {
    id: string;
    order_number: string;
    name: string;
    email: string;
    avatar: string | null;
    product: string;
    type: 'Custom' | 'Retail';
    total: number;
    status: string;
}

interface TopProduct {
    name: string;
    count: number;
    percent: string;
}

interface DashboardProps {
    metrics: {
        revenue: number;
        orders: number;
        custom_orders: number;
        users: number;
    };
    recent_orders: OrderData[];
    top_products: TopProduct[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

const getInitials = (name: string) => {
    return (
        name
            .match(/(\b\S)?/g)
            ?.join('')
            .match(/(^\S|\S$)?/g)
            ?.join('')
            .toUpperCase() || 'U'
    );
};

export default function Dashboard({ metrics, recent_orders, top_products }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto flex max-w-[1600px] flex-col gap-5 p-3 md:p-5">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Summary of your fashion store & custom orders performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-full">
                            <Download className="mr-1.5 size-3.5 md:size-4" />
                            Export Report
                        </Button>
                        <Link href="/orders">
                            <Button className="rounded-full">
                                <ShoppingBag className="mr-1.5 size-3.5 md:size-4" />
                                Manage Orders
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total Revenue"
                        value={formatCurrency(metrics.revenue)}
                        trend="+12%"
                        trendUp={true}
                        icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
                        badge="All Time"
                    />
                    <MetricCard
                        title="Total Orders"
                        value={metrics.orders.toLocaleString('en-US')}
                        trend="+5%"
                        trendUp={true}
                        icon={<ShoppingBag className="h-4 w-4 text-blue-600" />}
                        badge="All Time"
                    />
                    <MetricCard
                        title="Custom Orders"
                        value={`${metrics.custom_orders} Projects`}
                        trend="+2%"
                        trendUp={true}
                        icon={<Scissors className="h-4 w-4 text-orange-600" />}
                        badge="All Time"
                    />
                    <MetricCard
                        title="Active Customers"
                        value={metrics.users.toLocaleString('en-US')}
                        trend="+8%"
                        trendUp={true}
                        icon={<Users className="h-4 w-4 text-purple-600" />}
                        badge="Total Users"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                    <Card className="col-span-1 rounded-md border-border shadow-none lg:col-span-6">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-1">
                            <div>
                                <CardTitle className="text-base font-bold">Revenue Chart</CardTitle>
                                <CardDescription className="text-xs">
                                    Weekly report simulation
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-4 pl-0">
                            <div className="relative mt-2 h-[200px] w-full overflow-hidden px-4">
                                <svg
                                    viewBox="0 0 100 40"
                                    className="h-full w-full"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="fillGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#10b981"
                                                stopOpacity="0.3"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#10b981"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0,30 Q10,30 20,20 T40,20 T60,25 T80,10 T100,0 V40 H0 Z"
                                        fill="url(#fillGradient)"
                                    />
                                    <path
                                        d="M0,30 Q10,30 20,20 T40,20 T60,25 T80,10 T100,0"
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="0.5"
                                    />
                                </svg>
                                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                                    <span>MON</span>
                                    <span>TUE</span>
                                    <span>WED</span>
                                    <span>THU</span>
                                    <span>FRI</span>
                                    <span>SAT</span>
                                    <span>SUN</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 rounded-md border-border shadow-none lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                            <div>
                                <CardTitle className="text-base font-bold">Report</CardTitle>
                                <CardDescription className="text-xs">
                                    Rough Cash Estimate
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 px-4 pb-4">
                            <ReportItem
                                icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
                                label="Income"
                                value={formatCurrency(metrics.revenue)}
                                bg="bg-emerald-100"
                            />
                            <ReportItem
                                icon={<TrendingDown className="h-4 w-4 text-red-600" />}
                                label="Est. COGS (Expenses)"
                                value={formatCurrency(metrics.revenue * 0.4)}
                                bg="bg-red-100"
                            />
                            <ReportItem
                                icon={<Package className="h-4 w-4 text-amber-600" />}
                                label="Est. Profit"
                                value={formatCurrency(metrics.revenue * 0.6)}
                                bg="bg-amber-100"
                            />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 rounded-md border-border shadow-none lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
                            <div>
                                <CardTitle className="text-base font-bold">Top Products</CardTitle>
                                <CardDescription className="text-xs">
                                    Based on quantity sold
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4 pb-4">
                            {top_products.length > 0 ? (
                                top_products.map((item, i) => (
                                    <CampaignItem
                                        key={i}
                                        icon={
                                            <ShoppingBag className="h-3.5 w-3.5 text-orange-500" />
                                        }
                                        label={item.name}
                                        percent={item.percent}
                                        count={`${item.count} pcs`}
                                    />
                                ))
                            ) : (
                                <p className="py-4 text-center text-xs text-muted-foreground">
                                    No sales data available.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-4 shadow-none">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-bold">Recent Orders</h2>

                        <div className="mt-2 overflow-x-auto rounded-md border border-border">
                            <table className="w-full min-w-[800px] text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b text-left text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">Customer</th>
                                        <th className="px-4 py-2">Main Product</th>
                                        <th className="px-4 py-2">Type</th>
                                        <th className="px-4 py-2">Total</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recent_orders.length > 0 ? (
                                        recent_orders.map((order, i) => (
                                            <tr
                                                key={i}
                                                className="bg-card transition-colors hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        {order.avatar ? (
                                                            <img
                                                                src={order.avatar}
                                                                className="h-7 w-7 rounded-md object-cover"
                                                                alt="Avatar"
                                                            />
                                                        ) : (
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                                                                {getInitials(order.name)}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {order.name}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground">
                                                                {order.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2.5 text-sm">
                                                    <span className="font-medium">
                                                        {order.product}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <Badge
                                                        variant="secondary"
                                                        // Max rounded-md for badges
                                                        className={`rounded-md px-2 py-0.5 text-[11px] ${order.type === 'Custom' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                                    >
                                                        {order.type === 'Custom' ? (
                                                            <Scissors className="mr-1 h-3 w-3" />
                                                        ) : (
                                                            <ShoppingBag className="mr-1 h-3 w-3" />
                                                        )}
                                                        {order.type}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-sm font-medium">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <StatusBadge status={order.status} />
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Link href={`/orders/${order.id}/edit`}>
                                                            <ActionIconButton
                                                                icon={
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                }
                                                                tooltip="View Details"
                                                                onClick={() => {}}
                                                                variant="ghost"
                                                                className="h-7 w-7 rounded-full"
                                                            />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-6 text-center text-xs text-muted-foreground"
                                            >
                                                No incoming orders yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-3 flex items-center justify-center">
                            <Link href="/orders">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full px-6 text-xs"
                                >
                                    View All Orders
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const MetricCard = ({ title, value, trend, trendUp, icon, badge }: any) => (
    <Card className="rounded-md border-border shadow-none">
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/50 p-1.5">
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span
                        className={`flex items-center text-[11px] font-bold ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                        {trendUp ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {trend}
                    </span>
                </div>
            </div>
            <div className="mt-3">
                <h3 className="text-xl font-bold tracking-tight">{value}</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{title}</p>
                <div className="mt-2">
                    <Badge
                        variant="secondary"
                        // Max rounded-md for badges
                        className="rounded-md bg-muted/50 px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
                    >
                        {badge}
                    </Badge>
                </div>
            </div>
        </CardContent>
    </Card>
);

const ReportItem = ({ icon, label, value, bg }: any) => (
    <div className="flex items-center justify-between rounded-md border border-dashed border-border p-3">
        <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-md ${bg}`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="text-sm font-bold">{value}</span>
            </div>
        </div>
    </div>
);

const CampaignItem = ({ icon, label, percent, count }: any) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary">
                {icon}
            </div>
            <span className="max-w-[120px] truncate text-xs font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs font-bold">{count}</span>
            <span className="w-8 text-right text-[11px] text-muted-foreground">{percent}</span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { label: string; style: string }> = {
        pending: { label: 'Pending', style: 'bg-amber-100 text-amber-700' },
        paid: { label: 'Paid', style: 'bg-blue-100 text-blue-700' },
        packed: { label: 'Packed', style: 'bg-purple-100 text-purple-700' },
        shipped: { label: 'Shipped', style: 'bg-indigo-100 text-indigo-700' },
        completed: { label: 'Completed', style: 'bg-emerald-100 text-emerald-700' },
        cancelled: { label: 'Cancelled', style: 'bg-red-100 text-red-700' },
    };

    const current = statusMap[status?.toLowerCase()] || {
        label: status,
        style: 'bg-gray-100 text-gray-700',
    };

    return (
        <Badge
            variant="secondary"
            className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${current.style}`}
        >
            {current.label}
        </Badge>
    );
};
