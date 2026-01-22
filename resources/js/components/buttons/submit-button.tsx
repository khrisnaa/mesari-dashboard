import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '../ui/button';
import { Spinner } from '../ui/spinner';

type ButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

export interface SubmitButtonProps extends ButtonProps {
    processing: boolean;
    children: React.ReactNode;
}

export const SubmitButton = ({ processing, children, ...props }: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            size="lg"
            disabled={processing}
            className={cn('relative rounded-full', props.className)}
            {...props}
        >
            {processing && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <Spinner />
                </span>
            )}

            <span className={processing ? 'opacity-0' : 'opacity-100'}>{children}</span>
        </Button>
    );
};
