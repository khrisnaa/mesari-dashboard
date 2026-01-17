import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

interface DataTableFilterProps {
    placeholder?: string;
}
export const DataTableFilter = ({ placeholder }: DataTableFilterProps) => {
    const { params } = usePage<{
        params?: {
            search?: string;
        };
    }>().props;

    const initialSearch = params?.search ?? '';
    const [search, setSearch] = useState(initialSearch);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '?',
                {
                    ...params,
                    search,
                    page: 1,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <Input
            placeholder={`Search ${placeholder ?? 'items'} ...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
        />
    );
};
