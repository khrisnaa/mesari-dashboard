import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Category } from '@/types/category';
import { Button } from '../ui/button';
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
                </DialogHeader>
                <div className="rounded-md border px-4 py-6">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <p className="rounded-md border px-3 py-2 text-sm">
                                    {category.name}
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <p className="min-h-16 rounded-md border px-3 py-2 text-sm">
                                    {category.description}
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="parent_id">Parent</Label>
                                <p className="rounded-md border px-3 py-2 text-sm">
                                    {category.parent?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
