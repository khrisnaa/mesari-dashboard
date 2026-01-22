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
        meta: { width: { type: 'flex', fr: 2 } },
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const category = row.original;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2 px-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Category"
                            onClick={() => onEdit(category)}
                        />

                        <ActionIconButton
                            icon={<Trash2Icon className="h-4 w-4 text-red-500" />}
                            tooltip="Delete Category"
                            onClick={() => onDelete(category)}
                            className="text-red-500 hover:text-red-600"
                        />
                    </div>
                </TooltipProvider>
            );
        },

        meta: { width: { type: 'fixed', px: 108 } },
    },
];
