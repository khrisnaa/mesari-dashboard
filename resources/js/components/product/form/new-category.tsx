import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewCategoryDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export const NewCategoryDialog = ({
    open,
    onOpenChange,
}: NewCategoryDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new category</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                type="text"
                                autoComplete="off"
                                name="name"
                                placeholder="Tops"
                            />
                            <InputError message="" className="mt-2" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            size="lg"
                            className="rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button size="lg" className="rounded-full">
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
