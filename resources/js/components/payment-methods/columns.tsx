import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PaymentMethod } from '@/types/payment-method';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (payment: PaymentMethod) => void,
    onDelete: (payment: PaymentMethod) => void,
): ColumnDef<PaymentMethod>[] => [
    {
        id: 'rowNumber',
        header: () => <div className="px-2 text-center">#</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className="px-2 text-center">{pageIndex * pageSize + row.index + 1}</div>;
        },
        meta: { width: { type: 'fixed', px: 56 } },
    },
    {
        accessorKey: 'bank_name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Bank Name{' '}
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc' ? 'rotate-0' : '-rotate-180',
                    )}
                />
            </Button>
        ),
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'account_number',
        header: 'Account Number',
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
            <StatusBadge
                variant={row.original.is_active ? 'success' : 'default'}
                label={row.original.is_active ? 'Active' : 'Inactive'}
            />
        ),
        meta: { width: { type: 'fixed', px: 120 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <TooltipProvider delayDuration={150}>
                <div className="flex items-center justify-end gap-2 pr-2">
                    <ActionIconButton
                        icon={<EditIcon className="h-4 w-4" />}
                        tooltip="Edit"
                        onClick={() => onEdit(row.original)}
                        variant="ghost"
                    />
                    <ActionIconButton
                        icon={<Trash2Icon className="h-4 w-4 text-red-500" />}
                        tooltip="Delete"
                        onClick={() => onDelete(row.original)}
                        variant="ghost"
                    />
                </div>
            </TooltipProvider>
        ),
        meta: { width: { type: 'fixed', px: 100 } },
    },
];
