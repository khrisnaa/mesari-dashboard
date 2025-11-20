import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Category } from '@/types.ts/category';

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
                    <DialogTitle>{category.name}</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
