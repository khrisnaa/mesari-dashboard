import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, EyeIcon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (order: Order) => void,
    onShow: (order: Order) => void,
): ColumnDef<Order>[] => [
    {
        id: 'rowNumber',
        header: () => <div className="px-2 text-center">#</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className="px-2 text-center">{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
        meta: { width: { type: 'fixed', px: 56 } },
    },

    {
        accessorKey: 'order_number',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Order Number</span>
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-mono font-medium">{row.original.order_number}</span>
        ),
        meta: { width: { type: 'flex', fr: 2 } },
    },

    // {
    //     accessorKey: 'user.name',
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             size="sm"
    //             className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //         >
    //             <span>Customer</span>
    //             <ArrowUpIcon
    //                 className={cn(
    //                     'ml-2 h-3 w-3 transition-all',
    //                     column.getIsSorted() === 'asc'
    //                         ? 'rotate-0 opacity-100'
    //                         : column.getIsSorted() === 'desc'
    //                           ? '-rotate-180 opacity-100'
    //                           : 'opacity-0',
    //                 )}
    //             />
    //         </Button>
    //     ),
    //     cell: ({ row }) => <div className="truncate font-medium">{row.original.user?.name}</div>,
    //     meta: { width: { type: 'flex', fr: 1 } },
    // },

    // {
    //     accessorKey: 'user.name',
    //     header: ({ column }) => (
    //         <Button
    //             variant="ghost"
    //             size="sm"
    //             className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //         >
    //             <span>Customer</span>
    //             <ArrowUpIcon
    //                 className={cn(
    //                     'ml-2 h-3 w-3 transition-all',
    //                     column.getIsSorted() === 'asc'
    //                         ? 'rotate-0 opacity-100'
    //                         : column.getIsSorted() === 'desc'
    //                           ? '-rotate-180 opacity-100'
    //                           : 'opacity-0',
    //                 )}
    //             />
    //         </Button>
    //     ),
    //     cell: ({ row }) => <div className="truncate font-medium">{row.original.user?.name}</div>,
    //     meta: { width: { type: 'flex', fr: 1 } },
    // },

    // {
    //     id: 'shipping_address',
    //     header: () => (
    //         <Button
    //             variant="ghost"
    //             size="sm"
    //             className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
    //         >
    //             <span>Location</span>
    //         </Button>
    //     ),
    //     cell: ({ row }) => {
    //         const o = row.original;
    //         return (
    //             <div className="truncate">
    //                 {o.recipient_city}, {o.recipient_province}
    //             </div>
    //         );
    //     },
    //     meta: { width: { type: 'flex', fr: 1.2 } },
    // },

    {
        accessorKey: 'shipping_courier_service',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Courier</span>
            </Button>
        ),
        cell: ({ row }) => {
            const o = row.original;
            return (
                <div className="truncate font-medium">
                    {o.shipping_courier_code.toUpperCase()} – {o.shipping_courier_service}
                </div>
            );
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },

    {
        id: 'weight',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Weight</span>
            </Button>
        ),
        cell: ({ row }) => (
            <div className="truncate font-medium">{row.original.shipping_weight} g</div>
        ),
        meta: { width: { type: 'fixed', px: 100 } },
    },

    {
        id: 'tracking_number',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Tracking</span>
            </Button>
        ),
        cell: ({ row }) => {
            const val = row.original.shipping_tracking_number;
            return <div className="truncate font-medium">{val ?? '-'}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },

    {
        accessorKey: 'grand_total',
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
        cell: ({ row }) => (
            <div className="truncate font-medium">
                Rp {Number(row.original.grand_total).toLocaleString('id-ID')}
            </div>
        ),
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
                paid: 'success',
                packed: 'info',
                shipped: 'info',
                completed: 'success',
                cancelled: 'danger',
                waiting_approval: 'warning',
            };

            const variant = statusVariantMap[status] ?? 'default';

            return <StatusBadge variant={variant} label={status.split('_').join(' ')} />;
        },
        meta: { width: { type: 'fixed', px: 140 } },
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
                        status === 'paid'
                            ? 'success'
                            : status === 'failed'
                              ? 'danger'
                              : status === 'waiting_approval'
                                ? 'info'
                                : 'warning'
                    }
                    label={status.split('_').join(' ')}
                />
            );
        },
        meta: { width: { type: 'fixed', px: 140 } },
    },

    {
        id: 'actions',
        cell: ({ row }) => (
            <TooltipProvider delayDuration={150}>
                <div className="flex items-center justify-end gap-2 pr-2">
                    <ActionIconButton
                        icon={<EyeIcon className="h-4 w-4" />}
                        tooltip="Show Detail"
                        onClick={() => onShow(row.original)}
                        variant="ghost"
                        className="h-8 w-8 hover:bg-muted"
                    />
                    <ActionIconButton
                        icon={<EditIcon className="h-4 w-4" />}
                        tooltip="Edit Order"
                        onClick={() => onEdit(row.original)}
                        variant="ghost"
                        className="h-8 w-8 hover:bg-muted"
                    />
                </div>
            </TooltipProvider>
        ),
        meta: { width: { type: 'fixed', px: 100 } },
    },
];
