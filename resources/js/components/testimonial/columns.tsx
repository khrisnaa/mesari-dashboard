import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Testimonial } from '@/types/testimonial';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

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
            return <div className="px-3 text-wrap">{name}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.original.role;
            return <div className="text-wrap">{role}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'content',
        header: 'Content',
        cell: ({ row }) => {
            const content = row.original.content;
            return <div className="line-clamp-3 text-wrap">{content}</div>;
        },
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
                    <StatusBadge
                        variant={published ? 'success' : 'default'}
                        label={published ? 'Published' : 'Archived'}
                    />
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
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2 px-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Testimonial"
                            onClick={() => onEdit(testimonial)}
                        />

                        <ActionIconButton
                            icon={<Trash2Icon className="h-4 w-4 text-red-500" />}
                            tooltip="Delete Testimonial"
                            onClick={() => onDelete(testimonial)}
                            className="text-red-500 hover:text-red-600"
                        />
                    </div>
                </TooltipProvider>
            );
        },

        meta: { width: { type: 'fixed', px: 108 } },
    },
];
