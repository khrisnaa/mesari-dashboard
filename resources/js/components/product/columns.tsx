import { Product, ProductVariant } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { ArchiveIcon, ArrowUpIcon, EditIcon } from 'lucide-react';

import { formatRupiah } from '@/utils/formatRupiah';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import products from '@/routes/products';
import { router } from '@inertiajs/react';
import { StatusBadge } from '../status-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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
            const variantMap: Record<
                string,
                'success' | 'warning' | 'default' | 'danger' | 'info'
            > = {
                published: 'success',
                archived: 'default',
                draft: 'warning',
            };
            const variant = variantMap[status] ?? 'default';

            return (
                <div className="px-3">
                    <StatusBadge variant={variant} label={status} />
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;
            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2 px-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => router.get(products.edit(product))}
                                >
                                    <EditIcon className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent> Edit Product </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onArchive(product)}
                                >
                                    <ArchiveIcon className="h-4 w-4" />
                                    <span className="sr-only">Archive</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent> Archive Product </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            );
        },
        meta: { width: { type: 'fixed', px: 110 } },
    },
];
