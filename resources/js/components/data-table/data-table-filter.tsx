import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '../ui/input';

interface DataTableFilterProps {
    placeholder?: string;
}
export const DataTableFilter = ({ placeholder }: DataTableFilterProps) => {
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
            },
        );
    };
    return (
        <Input
            placeholder={`Filter ${placeholder ?? 'items'}...`}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
        />
    );
};
