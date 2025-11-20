import {
    ColumnDef,
    ColumnFiltersState,
    OnChangeFn,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaginationDetails } from '@/types.ts/pagination';
import { router, usePage } from '@inertiajs/react';
import DataTablePagination from './data-table-pagination';
import DataTableSearch from './data-table-search';

interface Filters {
    sort?: string;
    direction?: 'asc' | 'desc';
    search?: string;
    [key: string]: any;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination: PaginationDetails;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    pagination,
}: DataTableProps<TData, TValue>) {
    // const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [rowSelection, setRowSelection] = useState({});
    const [paginationRow, setPaginationRow] = useState({
        pageIndex: 0,
        pageSize: pagination.per_page,
    });
    const { filters } = usePage().props;

    const [sorting, setSorting] = useState<SortingState>(() => {
        //@ts-ignore
        if (filters.sort) {
            return [
                {
                    //@ts-ignore
                    id: filters.sort,
                    //@ts-ignore
                    desc: filters.direction === 'desc',
                },
            ];
        }
        return [];
    });

    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        setSorting((old) => {
            const next = typeof updater === 'function' ? updater(old) : updater;

            const sort = next[0]?.id ?? null;
            const direction = next[0]?.desc ? 'desc' : 'asc';

            router.get(
                '/products',
                {
                    //@ts-ignore
                    ...filters,
                    sort,
                    direction,
                    page: 1,
                    per_page: pagination.per_page,
                },
                {
                    preserveScroll: true,
                    replace: true,
                },
            );

            return next;
        });
    };

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: handleSortingChange,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPaginationRow,
        getRowId: (row) => row.id,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: paginationRow,
        },
    });

    return (
        <div>
            <div className="flex items-center py-4">
                <DataTableSearch />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                pagination={pagination}
                selected={table.getSelectedRowModel().rows.length}
                total={table.getFilteredRowModel().rows.length}
                table={table}
            />
        </div>
    );
}
