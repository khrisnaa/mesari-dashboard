import faqs from '@/routes/faqs';
import { DialogComponentProps } from '@/types/dialog';
import { Faq } from '@/types/faq';
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
    payload: faq,
}: DialogComponentProps<Faq>) => {
    if (!faq) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete FAQ</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to delete this FAQ?
                    </DialogDescription>
                </DialogHeader>

                <Form {...faqs.destroy.form(faq)} disableWhileProcessing onSuccess={close}>
                    {({ processing }) => (
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="rounded-full"
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
