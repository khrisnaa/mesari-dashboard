import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Category } from '@/types.ts/category';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from '../confirmation-dialog';
import { DetailDialog } from './detail-dialog';

export const columns: ColumnDef<Category>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
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
            <span className="block max-w-sm truncate">
                {row.original.description}
            </span>
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
                            router.delete(`/categories/${category.id}`);
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
                                    onClick={() =>
                                        router.get(
                                            `/categories/${category.id}/edit`,
                                        )
                                    }
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
