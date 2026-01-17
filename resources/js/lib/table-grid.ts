import { ColumnDef } from '@tanstack/react-table';

export function generateGridTemplate<TData, TValue>(columns: ColumnDef<TData, TValue>[]) {
    return columns
        .map((col) => {
            const w = col.meta?.width;

            if (!w) return '1fr';

            if (w.type === 'fixed') return `${w.px}px`;
            if (w.type === 'flex') return `${w.fr ?? 1}fr`;

            return '1fr';
        })
        .join(' ');
}
