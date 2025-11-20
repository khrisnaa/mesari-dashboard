import { cn } from '@/lib/utils';
import { PaginationDetails } from '@/types.ts/pagination';
import { router, usePage } from '@inertiajs/react';
import { Table } from '@tanstack/react-table';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface DataTablePaginationProps<TData> {
    selected: {
        count: number;
        total: number;
    };
    table: Table<TData>;
    pagination: PaginationDetails;
}

export const DataTablePagination = <TData,>({
    pagination,
    selected,
    table,
}: DataTablePaginationProps<TData>) => {
    const { filters } = usePage().props as any as {
        filters?: {
            search?: string;
            sort?: string;
            direction?: string;
            per_page?: number;
        };
    };

    const current = pagination.current_page;
    const last = pagination.last_page;

    const goTo = (page: number | string) => {
        if (typeof page !== 'number') return;
        router.get(
            `?`,
            {
                ...filters,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['products'],
            },
        );
    };

    const generatePages = (): (number | 'ellipsis')[] => {
        // Case 1: Small total pages → show all
        if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

        // Case 2: Near beginning
        if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', last];

        // Case 3: Near end
        if (current >= last - 3)
            return [
                1,
                'ellipsis',
                last - 4,
                last - 3,
                last - 2,
                last - 1,
                last,
            ];

        // Case 4: Middle
        return [
            1,
            'ellipsis',
            current - 1,
            current,
            current + 1,
            'ellipsis',
            last,
        ];
    };

    const pages = generatePages();

    const renderPage = (p: number | 'ellipsis', i: number) => {
        if (p === 'ellipsis') {
            return (
                <span
                    key={i}
                    className="flex w-10 items-center justify-center px-2"
                >
                    ...
                </span>
            );
        }

        return (
            <Button
                key={i}
                size="sm"
                variant={current === p ? 'default' : 'outline'}
                onClick={() => goTo(p)}
                className={cn(last <= 7 ? '' : 'w-10')}
            >
                {p}
            </Button>
        );
    };

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {selected.count} of {selected.total} row(s) selected.
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="mr-4 flex items-center justify-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            const size = Number(value);
                            table.setPageSize(size);
                            router.get(
                                `?`,
                                {
                                    ...filters,
                                    per_page: size,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                    only: ['products'],
                                },
                            );
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Prev */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.prev_page_url}
                    onClick={() => {
                        if (!pagination.prev_page_url) return;
                        goTo(pagination.current_page - 1);
                    }}
                >
                    Previous
                </Button>

                {/* Pages */}
                {pages.map(renderPage)}

                {/* Next */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.next_page_url}
                    onClick={() => {
                        if (!pagination.next_page_url) return;
                        goTo(pagination.current_page + 1);
                    }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
