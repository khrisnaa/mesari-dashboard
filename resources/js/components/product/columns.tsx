import { Product } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EyeIcon, MoreHorizontal, PencilIcon } from 'lucide-react';

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

export const columns: ColumnDef<Product>[] = [
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
        cell: ({ row }) => <div className="px-3">{row.original.name}</div>,
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return <div className="line-clamp-2 text-wrap">{row.original.description}</div>;
        },
        meta: { width: { type: 'flex', fr: 2 } },
    },
    {
        id: 'price',
        accessorFn: (row) => row.variants[0].price,
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
        cell: ({ row }) => (
            <div className="px-3 font-medium">{formatRupiah(row.original.variants[0].price)}</div>
        ),
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
        cell: ({ row }) => <div className="px-3 font-medium">{row.original.total_stock}</div>,
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
                                className="w-full"
                            >
                                <PencilIcon />
                                Edit
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Button variant="ghost" size="sm" className="w-full">
                                <EyeIcon />
                                Show
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        meta: { width: { type: 'fixed', px: 64 } },
    },
];
