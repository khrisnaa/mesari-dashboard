import testimonials from '@/routes/testimonials';
import { DialogComponentProps } from '@/types/dialog';
import { Testimonial } from '@/types/testimonial';
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
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
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
                            <div className="grid gap-4 py-2">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Client Name"
                                            autoComplete="off"
                                            defaultValue={testimonial.name}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            name="role"
                                            type="text"
                                            placeholder="Admin"
                                            defaultValue={testimonial.role}
                                        />
                                        <InputError message={errors.role} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        placeholder="Write the testimonial content here..."
                                        rows={4}
                                        className="resize-none"
                                        defaultValue={testimonial.content ?? ''}
                                    />
                                    <InputError message={errors.content} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sort_order">Sort Order</Label>
                                        <Input
                                            id="sort_order"
                                            name="sort_order"
                                            type="number"
                                            placeholder="0"
                                            min={0}
                                            defaultValue={testimonial.sort_order}
                                        />
                                        <p className="text-[0.8rem] text-muted-foreground">
                                            Display order (optional).
                                        </p>
                                        <InputError message={errors.sort_order} />
                                    </div>

                                    <div className="flex flex-col justify-start space-y-2">
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <Label
                                                    htmlFor="is_published"
                                                    className="cursor-pointer"
                                                >
                                                    Published
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Display on website?
                                                </p>
                                            </div>

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
                                        Update Testimonial
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
