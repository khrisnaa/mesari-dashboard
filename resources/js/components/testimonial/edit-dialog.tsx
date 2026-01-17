import testimonials from '@/routes/testimonials';
import { DialogComponentProps } from '@/types/dialog';
import { Testimonial } from '@/types/testimonial';
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
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

export const EditDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: testimonial,
}: DialogComponentProps<Testimonial>) => {
    if (!testimonial) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Testimonial</DialogTitle>
                    <DialogDescription>Update the testimonial information.</DialogDescription>
                </DialogHeader>

                <Form
                    {...testimonials.update.form(testimonial)}
                    resetOnSuccess={['name', 'role', 'content', 'sort_order', 'is_published']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={testimonial.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Role */}
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        id="role"
                                        name="role"
                                        type="text"
                                        defaultValue={testimonial.role}
                                        placeholder="e.g., CEO — ABC Company"
                                    />
                                    <InputError message={errors.role} />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        rows={4}
                                        defaultValue={testimonial.content ?? ''}
                                    />
                                    <InputError message={errors.content} />
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        min={0}
                                        defaultValue={testimonial.sort_order}
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>

                                {/* Published */}
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_published">Published</Label>

                                    <input type="hidden" name="is_published" value="0" />
                                    <Switch
                                        id="is_published"
                                        name="is_published"
                                        value="1"
                                        defaultChecked={testimonial.is_published}
                                    />
                                </div>

                                <InputError message={errors.is_published} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                <SubmitButton processing={processing}>Update</SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
