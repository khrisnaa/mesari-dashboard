import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    label: string;
    dot?: boolean;
}

export const StatusBadge = ({ variant = 'default', label, dot = true }: StatusBadgeProps) => {
    const styles = {
        success: 'bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
        warning: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-400/10 dark:text-yellow-400',
        danger: 'bg-red-600/10 text-red-600 dark:bg-red-400/10 dark:text-red-400',
        info: 'bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',
        default: 'bg-slate-500/10 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300',
    };

    const dotColor = {
        success: 'bg-green-600 dark:bg-green-400',
        warning: 'bg-yellow-600 dark:bg-yellow-400',
        danger: 'bg-red-600 dark:bg-red-400',
        info: 'bg-blue-600 dark:bg-blue-400',
        default: 'bg-slate-600 dark:bg-slate-400',
    };

    return (
        <Badge
            className={cn(
                'gap-1 rounded-full border-none px-2 py-1 capitalize focus-visible:ring-0 focus-visible:outline-none',
                styles[variant],
            )}
        >
            {dot && (
                <span
                    className={cn('size-1.5 rounded-full', dotColor[variant])}
                    aria-hidden="true"
                />
            )}
            {label}
        </Badge>
    );
};
