import { Product, ProductVariant } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { ArchiveIcon, ArchiveRestoreIcon, ArrowUpIcon, EditIcon, ImageIcon } from 'lucide-react';

import { formatRupiah } from '@/utils/formatRupiah';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import products from '@/routes/products';
import { router } from '@inertiajs/react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (onArchive: (product: Product) => void): ColumnDef<Product>[] => [
    {
        id: 'rowNumber',
        header: () => <div className="px-2 text-center">#</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            const rowNumber = pageIndex * pageSize + row.index + 1;

            return <div className="px-2 text-center">{rowNumber}</div>;
        },
        enableSorting: false,
        enableHiding: false,
        meta: { width: { type: 'fixed', px: 56 } },
    },
    {
        id: 'image',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Image</span>
            </Button>
        ),
        cell: ({ row }) => {
            const images = row.original.images || [];
            const thumbnail = images.find((img: any) => img.type === 'thumbnail') || images[0];

            return (
                <div className="py-2 pr-2">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border bg-muted/50">
                        {thumbnail ? (
                            <img
                                src={thumbnail.path}
                                alt={row.original.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                        )}
                    </div>
                </div>
            );
        },
        enableSorting: false,
        meta: { width: { type: 'fixed', px: 80 } },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Name</span>
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : column.getIsSorted() === 'desc'
                              ? '-rotate-180 opacity-100'
                              : 'opacity-0',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const name = row.original.name;
            return (
                <div className="max-w-[200px] truncate font-medium" title={name}>
                    {name}
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 1.5 } },
    },
    {
        id: 'price',
        accessorKey: 'variants',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Price</span>
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : column.getIsSorted() === 'desc'
                              ? '-rotate-180 opacity-100'
                              : 'opacity-0',
                    )}
                />
            </Button>
        ),
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
            return (
                <div className="font-medium text-muted-foreground">{getPriceRange(variants)}</div>
            );
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'total_stock',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Total Stock</span>
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : column.getIsSorted() === 'desc'
                              ? '-rotate-180 opacity-100'
                              : 'opacity-0',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const total_stock = row.original.total_stock;
            return (
                <div
                    className={cn(
                        'font-medium',
                        total_stock === 0 ? 'text-destructive' : 'text-foreground',
                    )}
                >
                    {total_stock}
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 0.8 } },
    },
    {
        accessorKey: 'is_published',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Status</span>
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : column.getIsSorted() === 'desc'
                              ? '-rotate-180 opacity-100'
                              : 'opacity-0',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const isPublished = row.original.is_published;
            const variant = isPublished ? 'success' : 'default';
            const label = isPublished ? 'Published' : 'Archived';

            return <StatusBadge variant={variant} label={label} />;
        },
        meta: { width: { type: 'fixed', px: 120 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const product = row.original;
            const isPublished = product.is_published;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Product"
                            onClick={() => router.get(products.edit(product))}
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                        />

                        <ActionIconButton
                            icon={
                                isPublished ? (
                                    <ArchiveIcon className="h-4 w-4" />
                                ) : (
                                    <ArchiveRestoreIcon className="h-4 w-4" />
                                )
                            }
                            tooltip={isPublished ? 'Archive Product' : 'Publish Product'}
                            onClick={() => onArchive(product)}
                            variant="ghost"
                            className={cn(
                                'h-8 w-8 hover:bg-muted',
                                isPublished
                                    ? 'text-destructive hover:text-destructive'
                                    : 'text-green-600 hover:text-green-700',
                            )}
                        />
                    </div>
                </TooltipProvider>
            );
        },
        meta: { width: { type: 'fixed', px: 100 } },
    },
];
