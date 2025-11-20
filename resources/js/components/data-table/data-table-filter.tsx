import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '../ui/input';

export const DataTableFilter = () => {
    const { filters } = usePage().props as any;
    const [search, setSearch] = useState(filters.search || '');
    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(
            `?search=${value}&page=1`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['products'],
            },
        );
    };
    return (
        <Input
            placeholder="Filter products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
        />
    );
};
