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
                    resetOnSuccess={['order_status', 'payment_status']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-mono text-sm">{order.id}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Order Status</Label>

                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(val) => {
                                            const hidden = document.getElementById(
                                                'status_input',
                                            ) as HTMLInputElement | null;
                                            if (hidden) hidden.value = val;
                                        }}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select order status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="packed">Packed</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <input
                                        type="hidden"
                                        id="status_input"
                                        name="status"
                                        defaultValue={order.status}
                                    />

                                    <InputError message={errors.status} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="payment_status">Payment Status</Label>

                                    <Select
                                        defaultValue={order.payment_status}
                                        onValueChange={(val) => {
                                            const hidden = document.getElementById(
                                                'payment_status_input',
                                            ) as HTMLInputElement | null;
                                            if (hidden) hidden.value = val;
                                        }}
                                    >
                                        <SelectTrigger id="payment_status">
                                            <SelectValue placeholder="Select payment status" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <input
                                        type="hidden"
                                        id="payment_status_input"
                                        name="payment_status"
                                        defaultValue={order.payment_status}
                                    />

                                    <InputError message={errors.payment_status} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full"
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
