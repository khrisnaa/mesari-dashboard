import { CompanyProfile } from '@/types/company-profile';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Invoice({ order, company }: { order: Order; company: CompanyProfile }) {
    useEffect(() => {
        window.print();
        window.onafterprint = () => {
            window.close();
        };
    }, []);

    const formatCurrency = (angka: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-black print:bg-white">
            <Head title={`Invoice - ${order.order_number}`} />

            <div className="mx-auto max-w-4xl bg-white p-8">
                {/* Header (MENGGUNAKAN DATA COMPANY) */}
                <div className="mb-8 flex items-start justify-between border-b-2 border-gray-200 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
                            INVOICE
                        </h1>
                        <p className="mt-1 font-mono text-gray-500">{order.order_number}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-gray-800">
                            {company?.company_name || 'YourBrand Store'}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {company?.address || 'Store Address'}
                            <br />
                            {company?.city || 'City'}, {company?.province || 'Province'}{' '}
                            {company?.postal_code || ''}
                            <br />
                            {company?.email || 'email@store.com'}
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="mb-8 grid grid-cols-2 gap-8 text-sm">
                    {/* ... (Bagian Billed To dan Detail Order sama seperti sebelumnya) ... */}
                    <div>
                        <p className="mb-2 text-xs font-semibold tracking-wider text-gray-800 uppercase">
                            Billed To:
                        </p>
                        <p className="text-base font-bold">{order.recipient_name}</p>
                        <p className="mt-1 whitespace-pre-line text-gray-600">
                            {order.recipient_address_line}
                            <br />
                            {order.recipient_district}, {order.recipient_city}
                            <br />
                            {order.recipient_province} {order.postal_code}
                        </p>
                        <p className="mt-1 text-gray-600">Phone: {order.recipient_phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-wider text-gray-800 uppercase">
                                Order Date:
                            </p>
                            <p className="text-gray-600">
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                    dateStyle: 'long',
                                })}
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-semibold tracking-wider text-gray-800 uppercase">
                                Payment Status:
                            </p>
                            <p className="font-bold text-emerald-600 uppercase">
                                {order.payment_status}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="mb-1 text-xs font-semibold tracking-wider text-gray-800 uppercase">
                                Shipping Method:
                            </p>
                            <p className="text-gray-600 uppercase">
                                {order.shipping_courier_code} - {order.shipping_courier_service}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ... (Table dan Calculation sama seperti sebelumnya) ... */}
                <table className="mb-8 w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="rounded-tl-lg px-4 py-3 font-semibold">Product</th>
                            <th className="w-24 px-4 py-3 text-center font-semibold">Qty</th>
                            <th className="w-36 px-4 py-3 text-right font-semibold">Price</th>
                            <th className="w-40 rounded-tr-lg px-4 py-3 text-right font-semibold">
                                Subtotal
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.items?.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-4">
                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        {item.variant_name}
                                    </p>
                                </td>
                                <td className="px-4 py-4 text-center text-gray-700">
                                    {item.quantity}
                                </td>
                                <td className="px-4 py-4 text-right text-gray-700">
                                    {formatCurrency(Number(item.price))}
                                </td>
                                <td className="px-4 py-4 text-right font-medium text-gray-900">
                                    {formatCurrency(Number(item.subtotal))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Calculation */}
                <div className="flex justify-end text-sm">
                    <div className="w-72 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span className="font-medium">
                                {formatCurrency(Number(order.subtotal))}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping ({order.shipping_weight}g)</span>
                            <span className="font-medium">
                                {formatCurrency(Number(order.shipping_cost))}
                            </span>
                        </div>
                        {Number(order.discount_amount) > 0 && (
                            <div className="flex justify-between text-red-500">
                                <span>Discount</span>
                                <span className="font-medium">
                                    -{formatCurrency(Number(order.discount_amount))}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>{formatCurrency(Number(order.grand_total))}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note (MENGGUNAKAN DATA COMPANY) */}
                <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                    <p>Thank you for shopping at {company?.company_name || 'our store'}.</p>
                    <p>
                        If you have any questions regarding this order, please contact{' '}
                        {company?.whatsapp || company?.email || 'us'}.
                    </p>
                </div>
            </div>
        </div>
    );
}
