import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { User } from '@/types/user';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpIcon, BanIcon, CheckCircleIcon, EditIcon, ImageIcon } from 'lucide-react';
import { ActionIconButton } from '../buttons/action-icon-button';
import { StatusBadge } from '../status-badge';
import { TooltipProvider } from '../ui/tooltip';

export const getColumns = (
    onEdit: (users: User) => void,
    onActive: (users: User) => void,
): ColumnDef<User>[] => [
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
        id: 'avatar',
        header: () => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 cursor-default data-[state=open]:bg-accent"
            >
                <span>Name</span>
            </Button>
        ),
        cell: ({ row }) => {
            const avatar = row.original.avatar;
            return (
                <div className="py-2 pr-2">
                    <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border bg-muted/50">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={row.original.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                        )}
                    </div>
                </div>
            );
        },
        enableSorting: false,
        meta: { width: { type: 'fixed', px: 80 } },
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
            return <div className="max-w-[200px] truncate font-medium">{name}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Email</span>
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
            const email = row.original.email;
            return <div className="truncate font-medium">{email}</div>;
        },
        meta: { width: { type: 'flex', fr: 1 } },
    },

    {
        accessorKey: 'email_verified_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Verified</span>
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
            const verifiedAt = row.original.email_verified_at;

            return (
                <StatusBadge
                    variant={verifiedAt ? 'success' : 'default'}
                    label={verifiedAt ? 'Verified' : 'Not Verified'}
                />
            );
        },
        meta: { width: { type: 'fixed', px: 200 } },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                <span>Status</span>
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
            const isActive = row.original.is_active;
            const status = isActive ? 'Active' : 'Inactive';
            const variant = isActive ? 'success' : 'danger';

            return <StatusBadge variant={variant} label={status} />;
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
                    <div className="flex items-center justify-end gap-2 pr-2">
                        <ActionIconButton
                            icon={<EditIcon className="h-4 w-4" />}
                            tooltip="Edit User"
                            onClick={() => onEdit(user)}
                            variant="ghost"
                            className="h-8 w-8 hover:bg-muted"
                        />

                        <ActionIconButton
                            icon={
                                isActive ? (
                                    <BanIcon className="h-4 w-4 text-red-500" />
                                ) : (
                                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                )
                            }
                            tooltip={isActive ? 'Deactivate User' : 'Activate User'}
                            onClick={() => onActive(user)}
                            variant="ghost"
                            className={cn(
                                'h-8 w-8 hover:bg-muted',
                                isActive
                                    ? 'text-red-500 hover:text-red-600'
                                    : 'text-green-600 hover:text-green-700',
                            )}
                        />
                    </div>
                </TooltipProvider>
            );
        },
        meta: { width: { type: 'fixed', px: 108 } },
    },
];
