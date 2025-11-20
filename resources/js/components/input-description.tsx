import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface InputDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    className?: string;
    formDescriptionId?: string;
}

export const InputDescription = ({
    className,
    formDescriptionId,
    ...props
}: InputDescriptionProps) => {
    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
};
