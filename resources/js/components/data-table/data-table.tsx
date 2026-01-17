import {
    ColumnDef,
    OnChangeFn,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
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

import { generateGridTemplate } from '@/lib/table-grid';
import { PaginationDetails } from '@/types/pagination';
import { router, usePage } from '@inertiajs/react';
import { DataTableFilter } from './data-table-filter';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination: PaginationDetails;
    name?: string;
}

export function DataTable<TData extends { id: string }, TValue>({
    columns,
    data,
    pagination,
    name,
}: DataTableProps<TData, TValue>) {
    const { params } = usePage().props as {
        params?: {
            search?: string;
            sort?: string;
            direction?: string;
            per_page?: number;
        };
    };
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const [rowSelection, setRowSelection] = useState({});

    const [paginationRow, setPaginationRow] = useState({
        pageIndex: 0,
        pageSize: params?.per_page ?? 10,
    });

    const [sorting, setSorting] = useState<SortingState>(() => {
        const sort = params?.sort;

        const direction = params?.direction;

        if (sort) {
            return [
                {
                    id: sort,
                    desc: direction === 'desc',
                },
            ];
        }
        return [];
    });

    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        setSorting((old) => {
            const next = typeof updater === 'function' ? updater(old) : updater;

            const first = next[0];
            const sort = first?.id ?? null;
            const direction = first?.desc ? 'desc' : 'asc';

            router.get(
                '?',
                {
                    ...params,
                    sort,
                    direction,
                    page: 1,
                    per_page: paginationRow.pageSize,
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
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: handleSortingChange,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPaginationRow,
        getRowId: (row) => row.id,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination: paginationRow,
        },
    });

    // column sizing handler
    const gridTemplate = generateGridTemplate(columns);

    return (
        <div>
            <div className="flex items-center py-4">
                <DataTableFilter placeholder={name} />
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="grid"
                                style={{ gridTemplateColumns: gridTemplate }}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="flex items-center">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
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
                                    data-state={row.getIsSelected() && 'selected'}
                                    className="grid"
                                    style={{ gridTemplateColumns: gridTemplate }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="flex items-center">
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination
                pagination={pagination}
                selected={{
                    count: table.getSelectedRowModel().rows.length,
                    total: table.getFilteredRowModel().rows.length,
                }}
                table={table}
            />
        </div>
    );
}
