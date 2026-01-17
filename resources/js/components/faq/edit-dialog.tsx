import faqs from '@/routes/faqs';
import { DialogComponentProps } from '@/types/dialog';
import { Faq } from '@/types/faq';
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
    payload: faq,
}: DialogComponentProps<Faq>) => {
    if (!faq) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit FAQ</DialogTitle>
                    <DialogDescription>Update the selected FAQ information.</DialogDescription>
                </DialogHeader>

                <Form
                    {...faqs.update.form(faq)}
                    resetOnSuccess={['question', 'answer', 'sort_order', 'is_published']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                {/* Question */}
                                <div className="space-y-2">
                                    <Label htmlFor="question">Question</Label>
                                    <Input
                                        id="question"
                                        name="question"
                                        type="text"
                                        placeholder="Enter question"
                                        defaultValue={faq.question}
                                        autoComplete="off"
                                        autoFocus
                                    />
                                    <InputError message={errors.question} />
                                </div>

                                {/* Answer */}
                                <div className="space-y-2">
                                    <Label htmlFor="answer">Answer</Label>
                                    <Textarea
                                        id="answer"
                                        name="answer"
                                        placeholder="Enter answer"
                                        rows={4}
                                        defaultValue={faq.answer}
                                    />
                                    <InputError message={errors.answer} />
                                </div>

                                {/* Sort order */}
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        placeholder="0"
                                        min={0}
                                        defaultValue={faq.sort_order}
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>

                                {/* Published */}
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="is_published">Published</Label>

                                    {/* Hidden input ensures false is sent when unchecked */}
                                    <input type="hidden" name="is_published" value="0" />

                                    <Switch
                                        id="is_published"
                                        name="is_published"
                                        value="1"
                                        defaultChecked={faq.is_published}
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
