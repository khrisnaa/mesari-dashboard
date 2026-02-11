import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Category } from '@/types/category';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (category: Category) => void,
    onDelete: (category: Category) => void,
): ColumnDef<Category>[] => [
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
        accessorKey: 'slug',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Slug</span>
            </Button>
        ),
        cell: ({ row }) => {
            const slug = row.original.slug;
            return (
                <div className="truncate font-medium" title={slug}>
                    {slug}
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const category = row.original;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Category"
                            onClick={() => onEdit(category)}
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                        />

                        <ActionIconButton
                            icon={<Trash2Icon className="h-4 w-4" />}
                            tooltip="Delete Category"
                            onClick={() => onDelete(category)}
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-muted hover:text-destructive"
                        />
                    </div>
                </TooltipProvider>
            );
        },

        meta: { width: { type: 'fixed', px: 108 } },
    },
];
