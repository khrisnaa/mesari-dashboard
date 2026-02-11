import categories from '@/routes/categories';
import { Category } from '@/types/category';
import { DialogComponentProps } from '@/types/dialog';
import { Form } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
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

export const EditDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: category,
}: DialogComponentProps<Category>) => {
    if (!category) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>Update the category information.</DialogDescription>
                </DialogHeader>

                <Form
                    {...categories.update.form(category)}
                    resetOnSuccess={['name', 'description']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 py-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Category name"
                                        autoFocus
                                        autoComplete="off"
                                        defaultValue={category?.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>
                            </div>

                            <DialogFooter>
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

                                <SubmitButton processing={processing}>
                                    <span className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Update Category
                                    </span>
                                </SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
