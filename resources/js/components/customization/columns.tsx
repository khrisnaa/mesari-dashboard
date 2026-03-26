import { Badge } from '@/components/ui/badge';
import { Customization } from '@/types/customization';
import { OrderStatus, PaymentStatus } from '@/types/enum';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, EyeIcon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';

export const getColumns = (
    onShow: (item: Customization) => void,
    onEdit: (item: Customization) => void,
): ColumnDef<Customization>[] => [
    {
        id: 'rowNumber',
        header: () => <div className="px-2 text-center">#</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className="px-2 text-center">{pageIndex * pageSize + row.index + 1}</div>;
        },
        meta: { width: { type: 'fixed', px: 50 } },
    },
    {
        id: 'user_name',
        accessorFn: (row) => row.user?.name,
        header: 'Customer',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.user?.name}</span>
                <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
                    {row.original.user?.email}
                </span>
            </div>
        ),
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'product_name',
        accessorFn: (row) => row.product?.name,
        header: 'Product',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="line-clamp-1 font-medium">{row.original.product?.name}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        {row.original.product_variant?.name}
                    </span>
                    <Badge variant="outline" className="h-4 px-1 text-[10px]">
                        {row.original.total_custom_sides} Sides
                    </Badge>
                </div>
            </div>
        ),
        meta: { width: { type: 'flex', fr: 1.5 } },
    },
    {
        id: 'payment_status',
        header: 'Payment',
        cell: ({ row }) => {
            const status = row.original.order_item?.order?.payment_status;
            if (!status) return <span className="text-xs text-muted-foreground">-</span>;

            return (
                <StatusBadge
                    variant={getPaymentVariant(status)}
                    label={status.replace('_', ' ').toUpperCase()}
                />
            );
        },
        meta: { width: { type: 'fixed', px: 180 } },
    },
    {
        id: 'order_status',
        header: 'Order Status',
        cell: ({ row }) => {
            const status = row.original.order_item?.order?.order_status;

            if (!status) return <span className="text-xs text-muted-foreground">-</span>;

            return (
                <StatusBadge
                    variant={getOrderVariant(status)}
                    label={status.replace('_', ' ').toUpperCase()}
                />
            );
        },
        meta: { width: { type: 'fixed', px: 180 } },
    },
    {
        id: 'additional_price',
        accessorFn: (row) => row.additional_price,
        header: 'Add. Price',
        cell: ({ row }) => (
            <span>Rp {Number(row.original.additional_price).toLocaleString('id-ID')}</span>
        ),
        meta: { width: { type: 'fixed', px: 120 } },
    },
    {
        id: 'actions',
        header: () => <div className="pr-4 text-right">Actions</div>,
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-1 pr-2">
                <ActionIconButton
                    icon={<EyeIcon className="h-4 w-4" />}
                    onClick={() => onShow(row.original)}
                    tooltip="View Production Assets"
                    variant="ghost"
                />
                <ActionIconButton
                    icon={<EditIcon className="h-4 w-4" />}
                    onClick={() => onEdit(row.original)}
                    tooltip="Edit Details"
                    variant="ghost"
                />
            </div>
        ),
        meta: { width: { type: 'fixed', px: 100 } },
    },
];

const getPaymentVariant = (status?: string) => {
    switch (status) {
        case PaymentStatus.PAID:
            return 'success';
        case PaymentStatus.PENDING:
        case PaymentStatus.WAITING_APPROVAL:
            return 'warning';
        case PaymentStatus.FAILED:
            return 'danger';
        default:
            return 'default';
    }
};

const getOrderVariant = (status?: string) => {
    switch (status) {
        case OrderStatus.COMPLETED:
            return 'success';
        case OrderStatus.SHIPPED:
        case OrderStatus.PACKED:
            return 'info';
        case OrderStatus.PENDING:
        case OrderStatus.WAITING_APPROVAL:
            return 'warning';
        case OrderStatus.CANCELLED:
            return 'danger';
        default:
            return 'default';
    }
};
