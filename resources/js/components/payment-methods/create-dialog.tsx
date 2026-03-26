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

export const CreateDialog = ({
    isOpen,
    close,
    onOpenChange,
}: Omit<DialogComponentProps<PaymentMethod>, 'payload'>) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                        Add a new bank account details for customer payments.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...paymentMethods.store.form()}
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
                                        <Input id="bank_name" name="bank_name" placeholder="BCA" />
                                        <InputError message={errors.bank_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="account_owner">Account Owner</Label>
                                        <Input
                                            id="account_owner"
                                            name="account_owner"
                                            placeholder="John Doe"
                                        />
                                        <InputError message={errors.account_owner} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account_number">Account Number</Label>
                                    <Input
                                        id="account_number"
                                        name="account_number"
                                        placeholder="1234567890"
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
                                        defaultChecked={true}
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
                                        Save
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
