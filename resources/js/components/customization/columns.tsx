import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Customization } from '@/types/customization';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, EditIcon, EyeIcon } from 'lucide-react';
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
        meta: { width: { type: 'fixed', px: 56 } },
    },
    {
        id: 'user_name',
        accessorFn: (row) => row.user?.name,
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Customer
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc' ? 'rotate-0' : '-rotate-180',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.user?.name}</div>,
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        id: 'product_name',
        accessorFn: (row) => row.product?.name,
        header: 'Product',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.product?.name}</span>
                <span className="text-xs text-muted-foreground">
                    {row.original.product_variant?.name}
                </span>
            </div>
        ),
        meta: { width: { type: 'flex', fr: 1.5 } },
    },
    {
        accessorKey: 'total_custom_sides',
        header: 'Sides',
        cell: ({ row }) => <Badge variant="outline">{row.original.total_custom_sides} Sides</Badge>,
        meta: { width: { type: 'fixed', px: 100 } },
    },
    {
        id: 'additional_price',
        accessorFn: (row) => row.additional_price,
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Add. Price
                <ArrowUpIcon
                    className={cn(
                        'ml-2 h-3 w-3 transition-all',
                        column.getIsSorted() === 'asc' ? 'rotate-0' : '-rotate-180',
                    )}
                />
            </Button>
        ),
        cell: ({ row }) => (
            <span>Rp {Number(row.original.additional_price).toLocaleString('id-ID')}</span>
        ),
        meta: { width: { type: 'fixed', px: 130 } },
    },
    {
        accessorKey: 'is_draft',
        header: 'Status',
        cell: ({ row }) => (
            <StatusBadge
                variant={row.original.is_draft ? 'default' : 'success'}
                label={row.original.is_draft ? 'Draft' : 'Ready'}
            />
        ),
        meta: { width: { type: 'fixed', px: 100 } },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2 pr-2">
                <ActionIconButton
                    icon={<EyeIcon className="h-4 w-4" />}
                    onClick={() => onShow(row.original)}
                    tooltip="View Details"
                    variant="ghost"
                />
                <ActionIconButton
                    icon={<EditIcon className="h-4 w-4" />}
                    onClick={() => onEdit(row.original)}
                    tooltip="Edit Price/Status"
                    variant="ghost"
                />
            </div>
        ),
        meta: { width: { type: 'fixed', px: 100 } },
    },
];
