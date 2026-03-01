import paymentMethods from '@/routes/payment-methods';
import { DialogComponentProps } from '@/types/dialog';
import { PaymentMethod } from '@/types/payment-method';
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

export const EditDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: payment,
}: DialogComponentProps<PaymentMethod>) => {
    if (!payment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Payment Method</DialogTitle>
                    <DialogDescription>
                        Update bank account details for customer payments.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...paymentMethods.update.form(payment)}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_name">Bank Name</Label>
                                        <Input
                                            id="bank_name"
                                            name="bank_name"
                                            defaultValue={payment.bank_name}
                                        />
                                        <InputError message={errors.bank_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="account_owner">Account Owner</Label>
                                        <Input
                                            id="account_owner"
                                            name="account_owner"
                                            defaultValue={payment.account_owner}
                                        />
                                        <InputError message={errors.account_owner} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account_number">Account Number</Label>
                                    <Input
                                        id="account_number"
                                        name="account_number"
                                        defaultValue={payment.account_number}
                                    />
                                    <InputError message={errors.account_number} />
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-3">
                                    <Label htmlFor="is_active">Active Status</Label>
                                    <input type="hidden" name="is_active" value="0" />
                                    <Switch
                                        id="is_active"
                                        name="is_active"
                                        value="1"
                                        defaultChecked={payment.is_active}
                                    />
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
                                        Update
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
