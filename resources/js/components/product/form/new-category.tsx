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
import { Spinner } from '@/components/ui/spinner';
import categories from '@/routes/categories';
import { Form } from '@inertiajs/react';

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
                <Form
                    {...categories.store.modal.form()}
                    resetOnSuccess={['name']}
                    disableWhileProcessing
                    className="flex flex-col gap-6"
                    onSuccess={() => onOpenChange(false)}
                    options={{
                        preserveScroll: true,
                        preserveState: true,
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6 py-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Category name"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full"
                                    tabIndex={5}
                                >
                                    {processing && <Spinner />}
                                    Create category
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
