import productReviews from '@/routes/productReviews';
import { DialogComponentProps } from '@/types/dialog';
import { ProductReview } from '@/types/product-review';
import { Form } from '@inertiajs/react';
import { Save, Star, X } from 'lucide-react';
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
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

export const EditDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: review,
}: DialogComponentProps<ProductReview>) => {
    if (!review) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Moderate Review</DialogTitle>
                    <DialogDescription>
                        Review the customer's feedback and manage its visibility on the product
                        page.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...productReviews.update.form(review)}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing }) => (
                        <>
                            <div className="grid gap-4 py-2">
                                {/* Tampilan Read-Only untuk Rating & Judul */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Rating & Title</Label>
                                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                                        <div className="flex items-center text-amber-500">
                                            {/* Looping bintang sesuai rating */}
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/30'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-medium">
                                            {review.title || 'No Title Provided'}
                                        </span>
                                    </div>
                                </div>

                                {/* Tampilan Read-Only untuk Konten Review */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Review Content</Label>
                                    <Textarea
                                        value={review.content || 'No content provided.'}
                                        readOnly
                                        className="resize-none bg-muted/50 text-muted-foreground"
                                        rows={4}
                                    />
                                </div>

                                {/* Switch untuk Publish/Unpublish */}
                                <div className="flex flex-col justify-start space-y-2 pt-2">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label
                                                htmlFor="is_published"
                                                className="cursor-pointer"
                                            >
                                                Publish Status
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show or hide this review from the public product
                                                page.
                                            </p>
                                        </div>
                                        <input type="hidden" name="is_published" value="0" />
                                        <Switch
                                            id="is_published"
                                            name="is_published"
                                            value="1"
                                            defaultChecked={review.is_published}
                                        />
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
                                        Save Changes
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
