import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Category } from '@/types.ts/category';
import { Label } from '../ui/label';

interface DetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category;
}
export const DetailDialog = ({
    open,
    onOpenChange,
    category,
}: DetailDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">Category Details</DialogTitle>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <div className={cn('text-sm')}>{category.name}</div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <div className={cn('text-sm')}>
                                {category.description}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Parent</Label>
                            <div className={cn('text-sm')}>
                                {category.parent?.name}
                            </div>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
