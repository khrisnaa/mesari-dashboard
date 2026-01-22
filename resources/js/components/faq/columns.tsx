import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Faq } from '@/types/faq';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (faq: Faq) => void,
    onDelete: (faq: Faq) => void,
): ColumnDef<Faq>[] => [
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
        accessorKey: 'question',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Question
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
            const question = row.original.question;
            return <div className="px-3 text-wrap">{question}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'answer',
        header: 'Answer',
        cell: ({ row }) => {
            const answer = row.original.answer;
            return <div className="line-clamp-3 text-wrap">{answer}</div>;
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
            const faq = row.original;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2 px-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit FAQ"
                            onClick={() => onEdit(faq)}
                        />
                        <ActionIconButton
                            icon={<Trash2Icon className="h-4 w-4 text-red-500" />}
                            tooltip="Delete FAQ"
                            onClick={() => onDelete(faq)}
                            className="text-red-500 hover:text-red-600"
                        />
                    </div>
                </TooltipProvider>
            );
        },

        meta: { width: { type: 'fixed', px: 108 } },
    },
];
