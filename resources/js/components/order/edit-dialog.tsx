import orders from '@/routes/orders';
import { DialogComponentProps } from '@/types/dialog';
import { Order } from '@/types/order';
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
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const EditDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: order,
}: DialogComponentProps<Order>) => {
    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit Order Status</DialogTitle>
                    <DialogDescription>Update the status of the selected order.</DialogDescription>
                </DialogHeader>

                <Form
                    {...orders.update.form(order)}
                    resetOnSuccess={['status']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                {/* Order ID (readonly info) */}
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-mono text-sm">{order.id}</p>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Order Status</Label>

                                    <Select name="status" defaultValue={order.status}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.status} />
                                </div>
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

                                <SubmitButton processing={processing}>Update Status</SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
