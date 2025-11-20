import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export const PageHeader = ({
    title,
    description,
    actions,
}: PageHeaderProps) => {
    return (
        <div className="flex justify-between">
            <div className="flex w-full items-end justify-between">
                <div className="flex-1">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {actions && <div>{actions}</div>}
        </div>
    );
};
