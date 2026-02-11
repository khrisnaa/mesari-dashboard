import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PaginationDetails } from '@/types/pagination';
import { router, usePage } from '@inertiajs/react';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    const { params } = usePage().props as any as {
        params?: {
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
                ...params,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
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
            return [1, 'ellipsis', last - 4, last - 3, last - 2, last - 1, last];

        // Case 4: Middle
        return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', last];
    };

    const pages = generatePages();

    return (
        <div className="flex items-center justify-between px-2">
            {/* Optional: Selected Row Count */}
            <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
                {pagination.total > 0 && (
                    <>
                        Showing {pagination.from ?? 0} to {pagination.to ?? 0} of {pagination.total}{' '}
                        {pagination.total === 1 ? 'item' : 'items'}.
                    </>
                )}
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
                {/* Rows Per Page Selector */}
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${params?.per_page ?? 10}`}
                        onValueChange={(value) => {
                            const size = Number(value);
                            table.setPageSize(size);
                            router.get(
                                `?`,
                                {
                                    ...params,
                                    per_page: size,
                                    page: 1, // Reset to first page when changing page size
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px] rounded-full">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.prev_page_url}
                        onClick={() => {
                            if (!pagination.prev_page_url) return;
                            goTo(pagination.current_page - 1);
                        }}
                        className="h-8 rounded-full px-3"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="hidden items-center gap-1 sm:flex">
                        {pages.map((p, i) => {
                            if (p === 'ellipsis') {
                                return (
                                    <span
                                        key={i}
                                        className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <Button
                                    key={i}
                                    variant={current === p ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => goTo(p)}
                                    className={cn(
                                        'h-8 w-8 rounded-full p-0 font-medium',
                                        current === p
                                            ? ''
                                            : 'text-muted-foreground hover:text-foreground',
                                    )}
                                >
                                    {p}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.next_page_url}
                        onClick={() => {
                            if (!pagination.next_page_url) return;
                            goTo(pagination.current_page + 1);
                        }}
                        className="h-8 rounded-full px-3"
                    >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
