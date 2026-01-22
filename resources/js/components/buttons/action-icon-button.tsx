import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface ActionIconButtonProps {
    icon: ReactNode;
    tooltip: string;
    onClick: () => void;
    className?: string;
}

export const ActionIconButton = ({ icon, tooltip, onClick, className }: ActionIconButtonProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onClick} className={className}>
                    {icon}
                    <span className="sr-only">{tooltip}</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
};
