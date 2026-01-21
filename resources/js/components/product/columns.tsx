import { Product, ProductVariant } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { ArchiveIcon, ArrowUpIcon, MoreHorizontal, PencilIcon } from 'lucide-react';

import { formatRupiah } from '@/utils/formatRupiah';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import products from '@/routes/products';
import { router } from '@inertiajs/react';
import { Badge } from '../ui/badge';

export const getColumns = (onArchive: (product: Product) => void): ColumnDef<Product>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        meta: { width: { type: 'fixed', px: 56 } },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Name
                <ArrowUpIcon
                    className={cn(
                        'ml-1 size-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : '-rotate-180 opacity-40',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const name = row.original.name;
            return <div className="px-3">{name}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'price',
        accessorKey: 'variants',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Price
                    <ArrowUpIcon
                        className={cn(
                            'ml-1 size-3 transition-all',
                            column.getIsSorted() === 'asc'
                                ? 'rotate-0 opacity-100'
                                : '-rotate-180 opacity-40',
                        )}
                    />
                </Button>
            );
        },
        cell: ({ row }) => {
            const variants = row.original.variants;
            const getPriceRange = (variants: ProductVariant[]) => {
                if (!variants || variants.length === 0) return '-';

                const prices = variants.map((v) => v.price);
                const min = Math.min(...prices);
                const max = Math.max(...prices);

                if (min === max) return formatRupiah(min);

                return `${formatRupiah(min)} - ${formatRupiah(max)}`;
            };
            return <div className="px-3 font-medium">{getPriceRange(variants)}</div>;
        },

        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'total_stock',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Total Stock
                <ArrowUpIcon
                    className={cn(
                        'ml-1 size-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : '-rotate-180 opacity-40',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const total_stock = row.original.total_stock;
            return <div className="px-3 font-medium">{total_stock}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Status
                <ArrowUpIcon
                    className={cn(
                        'ml-1 size-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : '-rotate-180 opacity-40',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.original.status;

            const color =
                status === 'published'
                    ? 'bg-green-500'
                    : status === 'archived'
                      ? 'bg-gray-400'
                      : status === 'draft'
                        ? 'bg-yellow-500'
                        : 'bg-slate-500';

            return <Badge className={`${color} text-white`}>{status}</Badge>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Button
                                onClick={() => router.get(products.edit(product))}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between"
                            >
                                Edit
                                <PencilIcon />
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Button
                                onClick={() => onArchive(product)}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-between"
                            >
                                Archive
                                <ArchiveIcon />
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        meta: { width: { type: 'fixed', px: 64 } },
    },
];
