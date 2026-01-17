import faqs from '@/routes/faqs';
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
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

export const CreateDialog = ({ isOpen, close, onOpenChange }: DialogComponentProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create FAQ</DialogTitle>
                    <DialogDescription>
                        Add a frequently asked question to your list.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...faqs.store.form()}
                    resetOnSuccess={['name', 'description']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="question">Question</Label>
                                    <Input
                                        id="question"
                                        name="question"
                                        type="text"
                                        placeholder="Enter question"
                                        autoFocus
                                        autoComplete="off"
                                    />
                                    <InputError message={errors.question} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="answer">Answer</Label>
                                    <Textarea
                                        id="answer"
                                        name="answer"
                                        placeholder="Enter answer"
                                        rows={4}
                                    />
                                    <InputError message={errors.answer} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        placeholder="0"
                                        min={0}
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_published">Published</Label>

                                    <input type="hidden" name="is_published" value="0" />
                                    <Switch id="is_published" name="is_published" value="1" />
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

                                <SubmitButton processing={processing}>Create</SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
