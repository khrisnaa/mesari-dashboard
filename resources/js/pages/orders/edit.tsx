import { SubmitButton } from '@/components/buttons/submit-button';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { ImageValue, SingleImageUpload } from '@/components/single-image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { OrderStatus, PaymentStatus } from '@/types/enum';
import { Order } from '@/types/order';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Package, Save, Truck, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    order: Order;
}

const Edit = ({ order }: PageProps) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Orders', href: '/orders' },
        { title: `Edit #${order.order_number}`, href: '' },
    ];

    const [paymentProofPreview, setPaymentProofPreview] = useState<ImageValue | null>(
        order.payment?.payment_proof
            ? { preview: `/storage/${order.payment.payment_proof}`, tempId: 'proof' }
            : null,
    );

    const handlePaymentProofChange = (val: ImageValue | null) => {
        setPaymentProofPreview(val);
        setData('payment_proof', val?.file ?? null);
    };

    const { data, setData, post, processing, errors } = useForm({
        order_status: order.order_status,
        payment_status: order.payment_status,
        shipping_tracking_number: order.shipping_tracking_number ?? '',
        shipping_estimation: order.shipping_estimation ?? '',
        recipient_name: order.recipient_name,
        recipient_phone: order.recipient_phone,
        recipient_address_line: order.recipient_address_line,
        payment_proof: null as File | null,
        admin_note: order.payment?.admin_note ?? '',
        _method: 'put',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/orders/${order.id}`, {
            forceFormData: true,
            method: 'put',
        });
    };

    console.log(order);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Order ${order.order_number}`} />

            <form
                onSubmit={submit}
                className="container mx-auto flex flex-1 flex-col gap-8 p-4 md:p-8"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <PageHeader
                        title={`Order ${order.order_number}`}
                        description={`Placed on ${new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}`}
                    />

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            onClick={() => history.back()}
                            size="lg"
                            className="gap-2 rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Cancel
                        </Button>
                        <SubmitButton processing={processing}>
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Update Order
                            </span>
                        </SubmitButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN: Order Details & Address */}
                    <div className="space-y-8 lg:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <UserIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Shipping Address</CardTitle>
                                    <CardDescription>
                                        Customer contact and delivery location details.
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient_name">Recipient Name</Label>
                                        <Input
                                            id="recipient_name"
                                            value={data.recipient_name}
                                            onChange={(e) =>
                                                setData('recipient_name', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.recipient_name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="recipient_phone">Phone Number</Label>
                                        <Input
                                            id="recipient_phone"
                                            value={data.recipient_phone}
                                            onChange={(e) =>
                                                setData('recipient_phone', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.recipient_phone} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="recipient_address_line">Address Line</Label>
                                    <Textarea
                                        id="recipient_address_line"
                                        rows={3}
                                        value={data.recipient_address_line}
                                        onChange={(e) =>
                                            setData('recipient_address_line', e.target.value)
                                        }
                                        className="resize-none"
                                    />
                                    <InputError message={errors.recipient_address_line} />
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                                    <div>
                                        Province:{' '}
                                        <span className="block font-medium text-foreground">
                                            {order.recipient_province}
                                        </span>
                                    </div>
                                    <div>
                                        City:{' '}
                                        <span className="block font-medium text-foreground">
                                            {order.recipient_city}
                                        </span>
                                    </div>
                                    <div>
                                        District:{' '}
                                        <span className="block font-medium text-foreground">
                                            {order.recipient_district}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-full bg-primary/10 p-2 text-primary">
                                    <Package className="h-5 w-5" />
                                </div>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-muted-foreground">
                                                <th className="py-3 text-left font-medium">
                                                    Product
                                                </th>
                                                <th className="py-3 text-center font-medium">
                                                    Qty
                                                </th>
                                                <th className="py-3 text-right font-medium">
                                                    Price
                                                </th>
                                                <th className="py-3 text-right font-medium">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items?.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b transition-colors hover:bg-muted/50"
                                                >
                                                    <td className="py-4">
                                                        <p className="font-medium">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {item.variant_name}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        Rp{' '}
                                                        {Number(item.price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="py-4 text-right font-medium">
                                                        Rp{' '}
                                                        {Number(item.subtotal).toLocaleString(
                                                            'id-ID',
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="font-medium">
                                                <td
                                                    colSpan={3}
                                                    className="pt-6 text-right text-muted-foreground"
                                                >
                                                    Grand Total
                                                </td>
                                                <td className="pt-6 text-right text-lg text-primary">
                                                    Rp{' '}
                                                    {Number(order.grand_total).toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Status & Payment */}
                    <div className="space-y-8">
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-base">Order Status</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>Fulfillment Status</Label>
                                    <Select
                                        value={data.order_status}
                                        onValueChange={(v) =>
                                            setData('order_status', v as OrderStatus)
                                        }
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(OrderStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.order_status} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tracking Number</Label>
                                    <div className="relative">
                                        <Truck className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="bg-background pl-9"
                                            placeholder="JNE123456789"
                                            value={data.shipping_tracking_number}
                                            onChange={(e) =>
                                                setData('shipping_tracking_number', e.target.value)
                                            }
                                        />
                                    </div>
                                    <InputError message={errors.shipping_tracking_number} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-3">
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                <CardTitle className="text-base">Payment Detail</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="space-y-2">
                                    <Label>Payment Status</Label>
                                    <Select
                                        value={data.payment_status}
                                        onValueChange={(v) =>
                                            setData('payment_status', v as PaymentStatus)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(PaymentStatus).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.payment_status} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Admin Note</Label>
                                    <Textarea
                                        placeholder="Add private note about this payment..."
                                        value={data.admin_note}
                                        onChange={(e) => setData('admin_note', e.target.value)}
                                        className="resize-none"
                                    />
                                    <InputError message={errors.admin_note} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Payment Proof</Label>

                                    <SingleImageUpload
                                        aspect="square"
                                        value={paymentProofPreview}
                                        onChange={handlePaymentProofChange}
                                    />

                                    <InputError message={errors.payment_proof} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
};

export default Edit;
