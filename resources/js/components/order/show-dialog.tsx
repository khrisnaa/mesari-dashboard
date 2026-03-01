import { StatusBadge } from '@/components/status-badge'; // Pastikan path ini benar
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { DialogComponentProps } from '@/types/dialog';
import { Order } from '@/types/order';
import { Calendar, MapPin, Package, Truck, User as UserIcon, X } from 'lucide-react';

export const ShowDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: order,
}: DialogComponentProps<Order>) => {
    if (!order) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[750px]">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-6">
                        <div>
                            <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
                            <DialogDescription>
                                Overview of order{' '}
                                <span className="font-mono text-primary">{order.order_number}</span>
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <StatusBadge
                                variant={order.order_status === 'pending' ? 'default' : 'success'}
                                label={order.order_status}
                            />
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-8 py-4">
                    {/* 1. Basic & Customer Info */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <SectionHeader icon={Calendar} title="General Info" />
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Order Number" value={order.order_number} mono />
                                <DetailItem
                                    label="Placed At"
                                    value={new Date(order.created_at).toLocaleDateString('id-ID', {
                                        dateStyle: 'medium',
                                    })}
                                />
                                <DetailItem
                                    label="Payment Status"
                                    value={order.payment_status.toUpperCase()}
                                />
                                <DetailItem
                                    label="Grand Total"
                                    value={`Rp ${Number(order.grand_total).toLocaleString('id-ID')}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SectionHeader icon={UserIcon} title="Customer Detail" />
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem label="Name" value={order.user?.name} />
                                <DetailItem label="Email" value={order.user?.email} />
                                <DetailItem label="Recipient" value={order.recipient_name} />
                                <DetailItem label="Phone" value={order.recipient_phone} />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 2. Shipping & Address */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <SectionHeader icon={Truck} title="Shipping Info" />
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    label="Courier"
                                    value={`${order.shipping_courier_code.toUpperCase()} (${order.shipping_courier_service})`}
                                />
                                <DetailItem
                                    label="Tracking Number"
                                    value={order.shipping_tracking_number}
                                    mono
                                />
                                <DetailItem label="Weight" value={`${order.shipping_weight} g`} />
                                <DetailItem label="Estimation" value={order.shipping_estimation} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <SectionHeader icon={MapPin} title="Delivery Address" />
                            <div className="rounded-md border bg-muted/50 p-3 text-sm leading-relaxed font-medium">
                                {order.recipient_address_line}
                                <br />
                                {order.recipient_district}, {order.recipient_city}
                                <br />
                                {order.recipient_province}, {order.postal_code}
                            </div>
                        </div>
                    </div>

                    {/* 3. Items List */}
                    <div className="space-y-4">
                        <SectionHeader icon={Package} title="Ordered Items" />
                        <div className="overflow-hidden rounded-lg border">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold">
                                            Product
                                        </th>
                                        <th className="px-4 py-2 text-center font-semibold">Qty</th>
                                        <th className="px-4 py-2 text-right font-semibold">
                                            Price
                                        </th>
                                        <th className="px-4 py-2 text-right font-semibold">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items?.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {item.product_name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {item.variant_name}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                Rp {Number(item.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 4. Notes */}
                    {order.note && (
                        <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                            <div className="text-xs font-bold text-amber-700 uppercase">
                                Customer Note:
                            </div>
                            <div className="text-sm text-amber-900 italic">"{order.note}"</div>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={close}
                        className="gap-2 rounded-full"
                    >
                        <X className="h-4 w-4" />
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="mt-1 mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
            {title}
        </span>
    </div>
);

const DetailItem = ({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: any;
    mono?: boolean;
}) => (
    <div className="space-y-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value ?? '-'}</div>
    </div>
);
