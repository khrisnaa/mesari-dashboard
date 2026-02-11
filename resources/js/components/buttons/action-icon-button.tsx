import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

interface ActionIconButtonProps
    extends React.ComponentProps<'button'>,
        VariantProps<typeof buttonVariants> {
    icon: ReactNode;
    tooltip: string;
    asChild?: boolean;
}

export const ActionIconButton = ({
    icon,
    tooltip,
    className,
    variant = 'outline',
    size = 'icon',
    ...props
}: ActionIconButtonProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={cn('transition-colors', className)}
                    {...props}
                >
                    {icon}
                    <span className="sr-only">{tooltip}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
};
