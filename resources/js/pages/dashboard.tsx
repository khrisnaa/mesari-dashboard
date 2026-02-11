import { ActionIconButton } from '@/components/buttons/action-icon-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    DollarSign,
    Download,
    Eye,
    Filter,
    MoreHorizontal,
    MoreVertical,
    Package,
    Palette,
    Scissors,
    Search,
    ShoppingBag,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="container mx-auto flex max-w-[1600px] flex-col gap-8 p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Ringkasan performa toko fashion & pesanan custom Anda.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-full">
                            <Download className="mr-2 h-4 w-4" />
                            Export Laporan
                        </Button>
                        <Button className="rounded-full">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Pesanan Baru
                        </Button>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total Penjualan"
                        value="Rp 134.400.000"
                        trend="+38%"
                        trendUp={true}
                        icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
                        badge="6 Bulan Terakhir"
                    />
                    <MetricCard
                        title="Total Pesanan"
                        value="1,255"
                        trend="+22%"
                        trendUp={true}
                        icon={<ShoppingBag className="h-5 w-5 text-blue-600" />}
                        badge="4 Bulan Terakhir"
                    />
                    <MetricCard
                        title="Pesanan Custom"
                        value="89 Project"
                        trend="+12%"
                        trendUp={true}
                        icon={<Scissors className="h-5 w-5 text-orange-600" />}
                        badge="Sedang Proses"
                    />
                    <MetricCard
                        title="Pelanggan Aktif"
                        value="42.4k"
                        trend="+9.2%"
                        trendUp={true}
                        icon={<Users className="h-5 w-5 text-purple-600" />}
                        badge="Total User"
                    />
                </div>

                {/* Middle Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Main Chart - Total Income (Mirip gambar referensi) */}
                    <Card className="col-span-1 border-none shadow-sm lg:col-span-6">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    Pendapatan Custom & Retail
                                </CardTitle>
                                <CardDescription>Overview laporan mingguan</CardDescription>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pl-0">
                            {/* Mock SVG Chart mimics the green wave in the image */}
                            <div className="relative h-[250px] w-full overflow-hidden px-4">
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
                                {/* Mock Axis Labels */}
                                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                    <span>SEN</span>
                                    <span>SEL</span>
                                    <span>RAB</span>
                                    <span>KAM</span>
                                    <span>JUM</span>
                                    <span>SAB</span>
                                    <span>MIN</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly Activity Report (Tengah) */}
                    <Card className="col-span-1 border-none shadow-sm lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold">Laporan</CardTitle>
                                <CardDescription>Aktivitas Mingguan</CardDescription>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <ReportItem
                                icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
                                label="Pemasukan"
                                value="Rp 5.550.000"
                                trend="+2.34k"
                                bg="bg-emerald-100"
                            />
                            <ReportItem
                                icon={<TrendingDown className="h-5 w-5 text-red-600" />}
                                label="Pengeluaran (Bahan)"
                                value="Rp 3.520.000"
                                trend="-1.4k"
                                bg="bg-red-100"
                            />
                            <ReportItem
                                icon={<Package className="h-5 w-5 text-amber-600" />}
                                label="Profit Bersih"
                                value="Rp 2.030.000"
                                trend="+3.22k"
                                bg="bg-amber-100"
                            />
                        </CardContent>
                    </Card>

                    {/* Monthly Campaign State (Kanan) */}
                    <Card className="col-span-1 border-none shadow-sm lg:col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    Kategori Terlaris
                                </CardTitle>
                                <CardDescription>7.58k Pengunjung Fashion</CardDescription>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <CampaignItem
                                icon={<ShoppingBag className="h-4 w-4 text-orange-500" />}
                                label="Kaos Polos"
                                percent="45%"
                                count="14,250"
                            />
                            <CampaignItem
                                icon={<Scissors className="h-4 w-4 text-blue-500" />}
                                label="Custom Sablon"
                                percent="32%"
                                count="4,523"
                            />
                            <CampaignItem
                                icon={<Palette className="h-4 w-4 text-purple-500" />}
                                label="Jaket / Hoodie"
                                percent="15%"
                                count="1,250"
                            />
                            <CampaignItem
                                icon={<Users className="h-4 w-4 text-emerald-500" />}
                                label="Aksesoris"
                                percent="8%"
                                count="750"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Filter & Table Section */}
                <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Pesanan Terbaru</h2>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            {/* Filters */}
                            <div className="flex flex-1 flex-wrap items-center gap-3">
                                <div className="w-full md:w-[200px]">
                                    <Select defaultValue="all">
                                        <SelectTrigger className="rounded-full">
                                            <SelectValue placeholder="Tipe Pesanan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tipe</SelectItem>
                                            <SelectItem value="retail">Ready Stock</SelectItem>
                                            <SelectItem value="custom">Custom Order</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full md:w-[200px]">
                                    <Select defaultValue="all">
                                        <SelectTrigger className="rounded-full">
                                            <SelectValue placeholder="Status Pembayaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Status</SelectItem>
                                            <SelectItem value="paid">Lunas</SelectItem>
                                            <SelectItem value="unpaid">Belum Bayar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="relative w-full md:w-[300px]">
                                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama pelanggan atau ID..."
                                        className="rounded-full pl-9"
                                    />
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b text-left text-xs font-medium text-muted-foreground uppercase">
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4">Produk</th>
                                    <th className="px-6 py-4">Tipe</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {dummyOrders.map((order, i) => (
                                    <tr
                                        key={i}
                                        className="bg-card transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    {order.avatar}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">
                                                        {order.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {order.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium">{order.product}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.type === 'Custom' ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                >
                                                    <Scissors className="mr-1 h-3 w-3" /> Custom
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                >
                                                    <ShoppingBag className="mr-1 h-3 w-3" /> Retail
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium">
                                            {order.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ActionIconButton
                                                icon={<Eye className="h-4 w-4" />}
                                                tooltip="Lihat Detail"
                                                onClick={() => {}}
                                                variant="ghost"
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <ActionIconButton
                                                icon={<MoreHorizontal className="h-4 w-4" />}
                                                tooltip="Menu Lainnya"
                                                onClick={() => {}}
                                                variant="ghost"
                                                className="h-8 w-8 rounded-full"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Mock */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <p>Menampilkan 1 sampai 5 dari 25 pesanan</p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="h-8 rounded-full px-4"
                            >
                                Sebelumnya
                            </Button>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-8 w-8 rounded-full p-0"
                                >
                                    1
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-full p-0"
                                >
                                    2
                                </Button>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 rounded-full px-4">
                                Berikutnya
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// --- Components & Data Helpers ---

const MetricCard = ({
    title,
    value,
    trend,
    trendUp,
    icon,
    badge,
}: {
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: React.ReactNode;
    badge: string;
}) => (
    <Card className="border-none shadow-sm transition-all hover:shadow-md">
        <CardContent className="p-6">
            <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/50 p-2.5">
                    {icon}
                </div>
                <div className="flex flex-col items-end">
                    <span
                        className={`flex items-center text-xs font-bold ${
                            trendUp ? 'text-emerald-600' : 'text-red-600'
                        }`}
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
            <div className="mt-4">
                <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{title}</p>
                <div className="mt-3">
                    <Badge
                        variant="secondary"
                        className="rounded-md bg-muted/50 font-normal text-muted-foreground"
                    >
                        {badge}
                    </Badge>
                </div>
            </div>
        </CardContent>
    </Card>
);

const ReportItem = ({
    icon,
    label,
    value,
    trend,
    bg,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    trend: string;
    bg: string;
}) => (
    <div className="flex items-center justify-between rounded-xl border border-dashed p-4">
        <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                <span className="text-lg font-bold">{value}</span>
            </div>
        </div>
        <div className="text-xs font-medium text-muted-foreground">{trend}</div>
    </div>
);

const CampaignItem = ({
    icon,
    label,
    percent,
    count,
}: {
    icon: React.ReactNode;
    label: string;
    percent: string;
    count: string;
}) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm font-bold">{count}</span>
            <span className="text-xs text-muted-foreground">{percent}</span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        Active: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
        Pending: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
        Inactive: 'bg-red-100 text-red-700 hover:bg-red-200',
        Proses: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    };

    return (
        <Badge
            variant="secondary"
            className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                styles[status] || 'bg-gray-100 text-gray-700'
            }`}
        >
            {status}
        </Badge>
    );
};

// --- Mock Data ---

const dummyOrders = [
    {
        name: 'Jack Alfredo',
        email: 'jack.alfredo@gmail.com',
        avatar: 'JA',
        product: 'Kaos Cotton 24s (Hitam)',
        type: 'Retail',
        total: 'Rp 85.000',
        status: 'Active',
    },
    {
        name: 'Sarah Mitchell',
        email: 'sarah.m@studio.com',
        avatar: 'SM',
        product: 'Custom Hoodie Komunitas',
        type: 'Custom',
        total: 'Rp 2.400.000',
        status: 'Active',
    },
    {
        name: 'Robert Chen',
        email: 'r.chen@startup.io',
        avatar: 'RC',
        product: 'Kemeja Flannel Kotak',
        type: 'Retail',
        total: 'Rp 185.000',
        status: 'Pending',
    },
    {
        name: 'Emily Wilson',
        email: 'emily.wilson@art.com',
        avatar: 'EW',
        product: 'Custom Tote Bag Canvas',
        type: 'Custom',
        total: 'Rp 450.000',
        status: 'Inactive',
    },
    {
        name: 'David Garcia',
        email: 'david.g@agency.net',
        avatar: 'DG',
        product: 'Jaket Denim Vintage',
        type: 'Retail',
        total: 'Rp 320.000',
        status: 'Active',
    },
];
