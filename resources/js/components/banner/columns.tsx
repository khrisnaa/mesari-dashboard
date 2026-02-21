import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import banners from '@/routes/banners';
import { Banner } from '@/types/banner';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (onDelete: (banner: Banner) => void): ColumnDef<Banner>[] => [
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
        accessorKey: 'title',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Title</span>
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
            const title = row.original.title;
            return <div className="truncate font-medium">{title}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'cta_type',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Type</span>
            </Button>
        ),
        cell: ({ row }) => {
            const type = row.original.cta_type;
            return <div className="truncate font-medium capitalize">{type}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'cta_text',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>CTA</span>
            </Button>
        ),
        cell: ({ row }) => {
            const cta_text = row.original.cta_text;
            return <div className="truncate font-medium capitalize">{cta_text}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'sort_order',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Sort Order</span>
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
            const sort_order = row.original.sort_order;
            return <div className="truncate font-medium">{sort_order}</div>;
        },
        meta: { width: { type: 'fixed', px: 160 } },
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
            const published = row.original.is_published;

            return (
                <StatusBadge
                    variant={published ? 'success' : 'default'}
                    label={published ? 'Published' : 'Archived'}
                />
            );
        },
        meta: { width: { type: 'fixed', px: 160 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const banner = row.original;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Banner"
                            onClick={() => router.get(banners.edit(banner))}
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                        />

                        <ActionIconButton
                            icon={<Trash2Icon className="h-4 w-4" />}
                            tooltip="Delete Banner"
                            onClick={() => onDelete(banner)}
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-muted hover:text-red-600"
                        />
                    </div>
                </TooltipProvider>
            );
        },

        meta: { width: { type: 'fixed', px: 108 } },
    },
];
