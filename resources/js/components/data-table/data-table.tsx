import { router, usePage } from '@inertiajs/react';
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
import { FileQuestion } from 'lucide-react'; // Icon for empty state
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
        <div className="space-y-4">
            {/* Filter Section */}
            <div className="flex items-center justify-between">
                <DataTableFilter placeholder={name} />
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="grid border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                style={{ gridTemplateColumns: gridTemplate }}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="flex items-center text-xs font-semibold text-muted-foreground uppercase"
                                        >
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
                                    className="grid items-center border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    style={{ gridTemplateColumns: gridTemplate }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="flex items-center overflow-hidden py-3 text-sm"
                                        >
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
                                    className="flex h-64 flex-col items-center justify-center gap-3 text-center"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <FileQuestion className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-foreground">
                                            No results found
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Try adjusting your search or filters to find what you're
                                            looking for.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
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
