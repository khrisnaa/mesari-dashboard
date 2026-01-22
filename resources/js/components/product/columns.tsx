import { Product, ProductVariant } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { ArchiveIcon, ArchiveRestoreIcon, ArrowUpIcon, EditIcon } from 'lucide-react';

import { formatRupiah } from '@/utils/formatRupiah';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import products from '@/routes/products';
import { router } from '@inertiajs/react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

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
            const isPublished = row.original.is_published;

            const variant = isPublished ? 'success' : 'default';
            const label = isPublished ? 'Published' : 'Archived';

            return (
                <div className="px-3">
                    <StatusBadge variant={variant} label={label} />
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;

            const isPublished = product.is_published;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2 px-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Product"
                            onClick={() => router.get(products.edit(product))}
                        />

                        <ActionIconButton
                            icon={
                                isPublished ? (
                                    <ArchiveIcon className="h-4 w-4 text-red-500" />
                                ) : (
                                    <ArchiveRestoreIcon className="h-4 w-4 text-green-600" />
                                )
                            }
                            tooltip={isPublished ? 'Archive Product' : 'Publish Product'}
                            onClick={() => onArchive(product)}
                            className={
                                isPublished
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-green-600 hover:text-green-700'
                            }
                        />
                    </div>
                </TooltipProvider>
            );
        },

        meta: { width: { type: 'fixed', px: 108 } },
    },
];
