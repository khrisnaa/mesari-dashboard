import products from '@/routes/products';
import { DialogComponentProps } from '@/types/dialog';
import { Product } from '@/types/product';
import { Form } from '@inertiajs/react';
import { Archive, Upload, X } from 'lucide-react';
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

    const isPublished = product.is_published;

    const title = isPublished ? 'Archive Product' : 'Publish Product';
    const description = isPublished
        ? 'This product will be archived and no longer visible to customers. You can publish it again anytime.'
        : 'This product will be published and become visible to customers. Continue?';

    const submitLabel = isPublished ? 'Archive' : 'Publish';
    const submitVariant = isPublished ? 'destructive' : 'default';

    const submitIcon = isPublished ? (
        <Archive className="h-4 w-4" />
    ) : (
        <Upload className="h-4 w-4" />
    );

    const nextValue = isPublished ? '0' : '1';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form
                    {...products.update.status.form(product)}
                    disableWhileProcessing
                    onSuccess={close}
                >
                    {({ processing }) => (
                        <div>
                            <input type="hidden" name="is_published" value={nextValue} />

                            <DialogFooter className="gap-2 sm:justify-end">
                                {/* Cancel Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 rounded-full"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>

                                {/* Submit Button */}
                                <SubmitButton processing={processing} variant={submitVariant}>
                                    <span className="flex items-center gap-2">
                                        {submitIcon}
                                        {submitLabel}
                                    </span>
                                </SubmitButton>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
