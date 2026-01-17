import categories from '@/routes/categories';
import { Category } from '@/types/category';
import { DialogComponentProps } from '@/types/dialog';
import { Form } from '@inertiajs/react';
import { SubmitButton } from '../buttons/submit-button';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

export const DeleteDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: category,
}: DialogComponentProps<Category>) => {
    if (!category) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to delete this item?
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...categories.destroy.form(category)}
                    disableWhileProcessing
                    onSuccess={close}
                >
                    {({ processing }) => (
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={close}
                                disabled={processing}
                            >
                                Cancel
                            </Button>

                            <SubmitButton processing={processing} variant="destructive">
                                Delete
                            </SubmitButton>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
