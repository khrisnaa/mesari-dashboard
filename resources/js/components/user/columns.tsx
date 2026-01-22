import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { User } from '@/types/user';
import { formatDate } from '@/utils/formatDate';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, BanIcon, CheckIcon, EditIcon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (users: User) => void,
    onActive: (users: User) => void,
): ColumnDef<User>[] => [
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
        accessorKey: 'email',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Email
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
            const email = row.original.email;
            return <div className="px-3">{email}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },

    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Created At
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
            const createdAt = row.original.created_at;

            return <div className="px-3 whitespace-nowrap">{formatDate(createdAt)}</div>;
        },
        meta: { width: { type: 'fixed', px: 160 } },
    },

    {
        accessorKey: 'email_verified_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="flex cursor-pointer items-center justify-center"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Verified
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
            const verifiedAt = row.original.email_verified_at;

            return (
                <div className="flex justify-center px-3">
                    <StatusBadge
                        variant={verifiedAt ? 'success' : 'default'}
                        label={verifiedAt ? 'Verified' : 'Not Verified'}
                    />
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 200 } },
    },
    {
        accessorKey: 'status',
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
            const isActive = row.original.is_active;
            const status = isActive ? 'Active' : 'Inactive';
            const variant = isActive ? 'success' : 'danger';

            return (
                <div className="flex justify-center px-3">
                    <StatusBadge variant={variant} label={status} />
                </div>
            );
        },
        meta: { width: { type: 'fixed', px: 200 } },
    },
    {
        id: 'actions',

        cell: ({ row }) => {
            const user = row.original;
            const isActive = user.is_active;

            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2 px-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit User"
                            onClick={() => onEdit(user)}
                        />

                        <ActionIconButton
                            icon={
                                isActive ? (
                                    <BanIcon className="h-4 w-4 text-red-500" />
                                ) : (
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                )
                            }
                            tooltip={isActive ? 'Deactivate User' : 'Activate User'}
                            onClick={() => onActive(user)}
                            className={
                                isActive
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-green-500 hover:text-green-600'
                            }
                        />
                    </div>
                </TooltipProvider>
            );
        },
        meta: { width: { type: 'fixed', px: 108 } },
    },
];
