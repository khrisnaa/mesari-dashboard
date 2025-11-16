import { Product } from '@/types.ts/product';
import { formatRupiah } from '@/utils/formatRupiah';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            return (
                <span className="block max-w-sm truncate">
                    {row.original.description}
                </span>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            return <span>{formatRupiah(row.original.price)}</span>;
        },
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
];
