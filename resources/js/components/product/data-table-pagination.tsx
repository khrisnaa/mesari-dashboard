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
    selected: number;
    total: number;
    table: Table<TData>;
    pagination: PaginationDetails;
}

const DataTablePagination = <TData,>({
    pagination,
    total,
    selected,
    table,
}: DataTablePaginationProps<TData>) => {
    const current = pagination.current_page;
    const last = pagination.last_page;

    const goTo = (page: number | string) => {
        if (typeof page !== 'number') return;

        router.get(
            `?`,
            {
                //@ts-ignore
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

    const { filters } = usePage().props;

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                {selected} of {total} row(s) selected.
            </div>

            <div className="flex items-center justify-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                        const size = Number(value);
                        table.setPageSize(size);

                        // update URL
                        const params = new URLSearchParams(
                            window.location.search,
                        );
                        params.set('per_page', size.toString());
                        params.set('page', '1'); // reset ke page 1
                        router.get(
                            `?${params.toString()}`,
                            {},
                            { preserveScroll: true },
                        );
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
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

            <div className="flex items-center justify-end space-x-2 py-4">
                {/* Prev */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.prev_page_url}
                    onClick={() =>
                        pagination.prev_page_url &&
                        router.get(
                            pagination.prev_page_url,
                            {
                                //@ts-ignore
                                ...filters,
                                page: pagination.current_page - 1,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                            },
                        )
                    }
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
                    onClick={() =>
                        pagination.next_page_url &&
                        router.get(
                            pagination.next_page_url,
                            {
                                //@ts-ignore
                                ...filters,
                                page: pagination.current_page + 1,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                replace: true,
                            },
                        )
                    }
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default DataTablePagination;
