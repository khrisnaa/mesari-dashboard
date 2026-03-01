import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductReview } from '@/types/product-review';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, Star, Trash2Icon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (review: ProductReview) => void,
    onDelete: (review: ProductReview) => void,
): ColumnDef<ProductReview>[] => [
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
        accessorKey: 'rating',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Rating</span>
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
            return (
                <div className="flex items-center gap-1 text-amber-500">
                    <span className="mr-1 font-medium text-foreground">{row.original.rating}</span>
                    <Star className="h-3.5 w-3.5 fill-current" />
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 100 } },
    },
    {
        accessorKey: 'title',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Title / Content</span>
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="truncate font-medium">{row.original.title || '-'}</span>
                    <span className="truncate text-xs text-muted-foreground">
                        {row.original.content || '-'}
                    </span>
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 1 } },
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
                    label={published ? 'Published' : 'Hidden'}
                />
            );
        },
        meta: { width: { type: 'fixed', px: 140 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const review = row.original;
            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Moderate Review"
                            onClick={() => onEdit(review)}
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                        />
                        <ActionIconButton
                            icon={<Trash2Icon className="h-4 w-4 text-red-500" />}
                            tooltip="Delete Review"
                            onClick={() => onDelete(review)}
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
