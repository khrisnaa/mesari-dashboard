// output => 17 Jan 2026
export function formatDate(date: string | null): string {
    if (!date) return '-';

    const d = new Date(date);

    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

// output => 17 Jan 2026, 12:46
export function formatDateTime(date: string | null): string {
    if (!date) return '-';

    const d = new Date(date);

    return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// output => 2026-01-17
export function formatDateShort(date: string | null): string {
    if (!date) return '-';

    return new Date(date).toISOString().split('T')[0];
}
