import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import banners from '@/routes/banners';
import { Banner } from '@/types/banner';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react';

export const getColumns = (onDelete: (banner: Banner) => void): ColumnDef<Banner>[] => [
    {
        id: 'rowNumber',
        header: '#',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;

            // index on current page → add offset for real number
            const rowNumber = pageIndex * pageSize + row.index + 1;

            return <span>{rowNumber}</span>;
        },
        enableSorting: false,
        enableHiding: false,
        meta: { width: { type: 'fixed', px: 56 } },
    },
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Title
                <ArrowUpIcon
                    className={cn(
                        'size-3 transition-all duration-300',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : '-rotate-180 opacity-40',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const title = row.original.title;
            return <div className="px-3">{title}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const description = row.original.description;
            return <div className="line-clamp-3 text-wrap">{description}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'cta_text',
        header: 'CTA Text',
        cell: ({ row }) => {
            const cta_text = row.original.cta_text;
            return <div className="text-wrap">{cta_text}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'sort_order',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Order
                <ArrowUpIcon
                    className={cn(
                        'size-3 transition-all duration-300',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : '-rotate-180 opacity-40',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const order = row.original.sort_order;
            return <div className="px-3 text-center">{order}</div>;
        },
        meta: { width: { type: 'fixed', px: 100 } },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Status
                <ArrowUpIcon
                    className={cn(
                        'size-3 transition-all duration-300',
                        column.getIsSorted() === 'asc'
                            ? 'rotate-0 opacity-100'
                            : '-rotate-180 opacity-40',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => {
            const active = row.original.is_active;

            return (
                <div className="flex justify-center px-3">
                    <span
                        className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
                        )}
                    >
                        {active ? 'Published' : 'Draft'}
                    </span>
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 120 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const banner = row.original;
            return (
                <>
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
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between"
                                >
                                    <Link href={banners.edit(banner)}>
                                        Edit <PencilIcon />
                                    </Link>
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between text-red-500 hover:text-red-600"
                                    onClick={() => onDelete(banner)}
                                >
                                    Delete <TrashIcon className="text-red-500" />
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
        meta: { width: { type: 'fixed', px: 64 } },
    },
];
