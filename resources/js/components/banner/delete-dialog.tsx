import banners from '@/routes/banners';
import { Banner } from '@/types/banner';
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
    payload: banner,
}: DialogComponentProps<Banner>) => {
    if (!banner) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete Banner</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to delete this banner?
                    </DialogDescription>
                </DialogHeader>

                <Form {...banners.destroy.form(banner)} disableWhileProcessing onSuccess={close}>
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
