import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (onEdit: (order: Order) => void): ColumnDef<Order>[] => [
    {
        id: 'rowNumber',
        header: '#',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <span>{pageIndex * pageSize + row.index + 1}</span>;
        },
        enableSorting: false,
        enableHiding: false,
        meta: { width: { type: 'fixed', px: 56 } },
    },

    {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => (
            <span className="font-mono text-xs">{row.original.id.slice(0, 8)}…</span>
        ),
        meta: {
            width: { type: 'fixed', px: 140 },
            //@ts-ignore
            sortKey: 'user_name',
        },
    },

    {
        accessorKey: 'user.name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Customer
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
        cell: ({ row }) => <div className="px-3">{row.original.user?.name ?? '-'}</div>,
        meta: { width: { type: 'flex', fr: 1 } },
    },

    {
        accessorKey: 'total',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Total
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
        cell: ({ row }) => (
            <div className="px-3 font-medium">
                Rp {Number(row.original.total).toLocaleString('id-ID')}
            </div>
        ),
        meta: { width: { type: 'fixed', px: 140 } },
    },

    {
        accessorKey: 'status',
        header: 'Order Status',
        cell: ({ row }) => {
            const order = row.original;
            const status: string = row.original.status;

            const statusVariantMap: Record<
                string,
                'success' | 'warning' | 'info' | 'danger' | 'default'
            > = {
                pending: 'warning',
                processing: 'info',
                shipped: 'info',
                completed: 'success',
                cancelled: 'danger',
            };

            const variant = statusVariantMap[status] ?? 'default';

            return <StatusBadge variant={variant} label={status} />;
        },
        meta: { width: { type: 'fixed', px: 200 } },
    },

    {
        accessorKey: 'payment_status',
        header: 'Payment',
        cell: ({ row }) => {
            const status = row.original.payment_status;

            return (
                <div>
                    <StatusBadge
                        variant={status === 'paid' ? 'success' : 'warning'}
                        label={status}
                    />
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 200 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const order = row.original;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center px-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Status"
                            onClick={() => onEdit(order)}
                        />
                    </div>
                </TooltipProvider>
            );
        },
        meta: { width: { type: 'fixed', px: 64 } },
    },
];
