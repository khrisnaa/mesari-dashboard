import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import categories from '@/routes/categories';
import { Category } from '@/types/category';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from '../confirmation-dialog';
import { DetailDialog } from './detail-dialog';

export const columns: ColumnDef<Category>[] = [
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
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <span className="block max-w-sm truncate">{row.original.description}</span>
        ),
    },
    {
        id: 'parent',
        accessorFn: (row) => row.parent?.name ?? '-',
        header: 'Parent',
        cell: ({ row }) => <span>{row.original.parent?.name ?? '-'}</span>,
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const category = row.original;
            const [isDetailOpen, setIsDetailOpen] = useState(false);
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            return (
                <>
                    <DetailDialog
                        category={category}
                        open={isDetailOpen}
                        onOpenChange={setIsDetailOpen}
                    />
                    <ConfirmationDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        title="Delete Category?"
                        description="This action cannot be undone. This category will be permanently removed."
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        variant="danger"
                        onConfirm={() => {
                            router.delete(categories.destroy(category));
                        }}
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Button
                                    onClick={() => router.get(categories.edit(category))}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between"
                                >
                                    Edit <Pencil />
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between"
                                    onClick={() => setIsDetailOpen(true)}
                                >
                                    Show <Eye />
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between text-red-500 hover:text-red-600"
                                    onClick={() => setIsDeleteOpen(true)}
                                >
                                    Delete <Trash className="text-red-500" />
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];
