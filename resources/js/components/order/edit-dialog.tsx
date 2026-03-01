import orders from '@/routes/orders';
import { DialogComponentProps } from '@/types/dialog';
import { Order } from '@/types/order';
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
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit Order Status</DialogTitle>
                    <DialogDescription>
                        Update the fulfillment and payment status of the selected order.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...orders.update.status.form(order)}
                    resetOnSuccess={['order_status', 'payment_status']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 py-2">
                                {/* Order ID (Read-only) */}
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Order ID</Label>
                                    <Input
                                        value={`#${order.id}`}
                                        disabled
                                        className="bg-muted font-mono text-muted-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Order Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Order Status</Label>
                                        <Select
                                            defaultValue={order.order_status}
                                            onValueChange={(val) => {
                                                const hidden = document.getElementById(
                                                    'status_input',
                                                ) as HTMLInputElement | null;
                                                if (hidden) hidden.value = val;
                                            }}
                                        >
                                            <SelectTrigger id="status">
                                                <SelectValue placeholder="Select status" />
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
                                            defaultValue={order.order_status}
                                        />
                                        <InputError message={errors.status} />
                                    </div>

                                    {/* Payment Status */}
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
                                        Update Order
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
