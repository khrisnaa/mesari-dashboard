export type ColumnWidth = { type: 'fixed'; px: number } | { type: 'flex'; fr?: number };

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        width?: ColumnWidth;
    }
}
