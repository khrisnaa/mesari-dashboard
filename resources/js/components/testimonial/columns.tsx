import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/types/testimonial';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, MoreHorizontal, PencilIcon, TrashIcon } from 'lucide-react';

export const getColumns = (
    onEdit: (testimonials: Testimonial) => void,
    onDelete: (testimonials: Testimonial) => void,
): ColumnDef<Testimonial>[] => [
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
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Name
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
            const name = row.original.name;
            return <div className="px-3">{name}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'role',
        header: 'Role',
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'content',
        header: 'Content',
        meta: { width: { type: 'flex', fr: 2 } },
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
        accessorKey: 'is_published',
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
            const published = row.original.is_published;

            return (
                <div className="flex justify-center px-3">
                    <span
                        className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
                        )}
                    >
                        {published ? 'Published' : 'Draft'}
                    </span>
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 120 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const testimonial = row.original;
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
                                    onClick={() => onEdit(testimonial)}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between"
                                >
                                    Edit <PencilIcon />
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between text-red-500 hover:text-red-600"
                                    onClick={() => onDelete(testimonial)}
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
