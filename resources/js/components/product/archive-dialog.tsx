import products from '@/routes/products';
import { DialogComponentProps } from '@/types/dialog';
import { Product } from '@/types/product';
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

export const ArchiveDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: product,
}: DialogComponentProps<Product>) => {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Archive Product</DialogTitle>
                    <DialogDescription>
                        This will archive the product. The product will no longer be visible to
                        customers, but you can restore it anytime. Are you sure you want to
                        continue?
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...products.update.status.form(product)}
                    disableWhileProcessing
                    onSuccess={close}
                >
                    {({ processing }) => (
                        <div>
                            <input type="hidden" name="status" value="archived" />
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
                                    Archive
                                </SubmitButton>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
