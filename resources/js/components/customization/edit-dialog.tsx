import customizations from '@/routes/customizations';
import { Customization } from '@/types/customization';
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
    payload: customization,
}: DialogComponentProps<Customization>) => {
    if (!customization) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Update Customization</DialogTitle>
                    <DialogDescription>
                        Review the design complexity and set the final price or status.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...customizations.update.form(customization)}
                    resetOnSuccess={['additional_price']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 py-2">
                                {/* Read-only Info: Product & Sides */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Product</Label>
                                        <Input
                                            value={customization.product?.name ?? '-'}
                                            disabled
                                            className="bg-muted text-muted-foreground"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">
                                            Custom Sides
                                        </Label>
                                        <Input
                                            value={`${customization.total_custom_sides} Sides`}
                                            disabled
                                            className="bg-muted text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Additional Price Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="additional_price">
                                            Additional Price (Rp)
                                        </Label>
                                        <Input
                                            id="additional_price"
                                            name="additional_price"
                                            type="number"
                                            min={0}
                                            defaultValue={customization.additional_price}
                                        />
                                        <InputError message={errors.additional_price} />
                                    </div>

                                    {/* Draft / Ready Status (Using Select to match pattern) */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="is_draft">Status</Label>
                                        <Select
                                            defaultValue={customization.is_draft ? '1' : '0'}
                                            onValueChange={(val) => {
                                                const hidden = document.getElementById(
                                                    'is_draft_input',
                                                ) as HTMLInputElement | null;
                                                if (hidden) hidden.value = val;
                                            }}
                                        >
                                            <SelectTrigger id="is_draft">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Draft</SelectItem>
                                                <SelectItem value="0">Production Ready</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="hidden"
                                            id="is_draft_input"
                                            name="is_draft"
                                            defaultValue={customization.is_draft ? '1' : '0'}
                                        />
                                        <InputError message={errors.is_draft} />
                                    </div> */}
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
