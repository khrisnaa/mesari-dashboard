import categories from '@/routes/categories';
import { DialogComponentProps } from '@/types/dialog';
import { Form } from '@inertiajs/react';
import { SubmitButton } from '../buttons/submit-button';
import InputError from '../input-error';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const CreateDialog = ({ isOpen, close, onOpenChange }: DialogComponentProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>Add a new category to your collection.</DialogDescription>
                </DialogHeader>

                <Form
                    {...categories.store.form()}
                    resetOnSuccess={['name', 'description']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoFocus
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Category name"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

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

                                <SubmitButton processing={processing}>Create</SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
