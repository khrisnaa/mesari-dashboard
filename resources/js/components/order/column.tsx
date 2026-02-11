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
        accessorKey: 'id',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Order ID</span>
            </Button>
        ),
        cell: ({ row }) => (
            <span className="truncate font-mono font-medium">{row.original.id}…</span>
        ),
        meta: {
            width: { type: 'flex', fr: 1 },
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
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Customer</span>
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
            const name = row.original.user?.name;
            return <div className="truncate font-medium">{name}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },

    {
        accessorKey: 'total',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Total</span>
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
            const total = row.original.total;
            return (
                <div className="truncate font-medium">
                    Rp {Number(total).toLocaleString('id-ID')}
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 140 } },
    },

    {
        accessorKey: 'order_status',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Order Status</span>
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
            const status: string = row.original.order_status;

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
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Payment Status</span>
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
            const status = row.original.payment_status;

            return (
                <StatusBadge
                    variant={
                        status === 'paid' ? 'success' : status === 'failed' ? 'danger' : 'warning'
                    }
                    label={status}
                />
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
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit Status"
                            onClick={() => onEdit(order)}
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                        />
                    </div>
                </TooltipProvider>
            );
        },
        meta: { width: { type: 'fixed', px: 64 } },
    },
];
