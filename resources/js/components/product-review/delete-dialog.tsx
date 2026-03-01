import productReviews from '@/routes/productReviews';
import { DialogComponentProps } from '@/types/dialog';
import { ProductReview } from '@/types/product-review';
import { Form } from '@inertiajs/react';
import { Trash2, X } from 'lucide-react';
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
    payload: review,
}: DialogComponentProps<ProductReview>) => {
    if (!review) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Review</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to completely remove
                        this product review?
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...productReviews.destroy.form(review)}
                    disableWhileProcessing
                    onSuccess={close}
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={close}
                                disabled={processing}
                                size="lg"
                                className="gap-2 rounded-full"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>

                            <SubmitButton processing={processing} variant="destructive">
                                <span className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </span>
                            </SubmitButton>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
