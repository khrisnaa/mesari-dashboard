import { CompanyProfile } from '@/types/company-profile';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Invoice({ order, company }: { order: Order; company: CompanyProfile }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        window.onafterprint = () => {
            window.close();
        };

        return () => clearTimeout(timer);
    }, []);

    const formatCurrency = (angka: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <div className="flex min-h-screen justify-center bg-gray-100 py-10 font-sans text-black print:m-0 print:bg-white print:py-0">
            <Head title={`Invoice - ${order.order_number}`} />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @page { 
                    size: A4; 
                    margin: 0; 
                }
                @media print {
                    html, body {
                        background: #fff;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print-container { 
                        width: 210mm;
                        min-height: 297mm;
                        margin: 0 auto !important;
                        padding: 15mm !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    /* Pastikan background color tercetak */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    header, footer { display: none !important; }
                }
            `,
                }}
            />

            <div className="print-container w-[210mm] bg-white p-[15mm] shadow-lg print:shadow-none">
                {/* --- HEADER SECTION --- */}
                <div className="mb-8 flex items-start justify-between border-b-2 border-gray-800 pb-6">
                    {/* Logo / Company Info */}
                    <div className="max-w-[50%]">
                        <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 uppercase">
                            {company?.company_name || 'INVOICE'}
                        </h1>
                        <div className="text-sm leading-snug text-gray-600">
                            <p>{company?.address || 'Company Address'}</p>
                            <p>
                                {company?.city_name || 'City'},{' '}
                                {company?.province_name || 'Province'} {company?.postal_code || ''}
                            </p>
                            <p className="mt-1">
                                {company?.phone && <span>Tel: {company.phone}</span>}
                                {company?.whatsapp && (
                                    <span className="ml-2">WA: {company.whatsapp}</span>
                                )}
                            </p>
                            <p>{company?.email && <span>Email: {company.email}</span>}</p>
                        </div>
                    </div>

                    {/* Invoice Meta */}
                    <div className="text-right">
                        <h2 className="text-4xl font-black tracking-widest text-gray-200 uppercase print:text-gray-300">
                            INVOICE
                        </h2>
                        <div className="mt-2 text-sm">
                            <table className="ml-auto text-right">
                                <tbody>
                                    <tr>
                                        <td className="pr-3 font-semibold text-gray-500 uppercase">
                                            Inv No:
                                        </td>
                                        <td className="font-mono font-bold text-gray-900">
                                            {order.order_number}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 font-semibold text-gray-500 uppercase">
                                            Date:
                                        </td>
                                        <td className="text-gray-900">
                                            {new Date(order.created_at).toLocaleDateString(
                                                'en-GB',
                                                {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                },
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 font-semibold text-gray-500 uppercase">
                                            Status:
                                        </td>
                                        <td className="font-bold text-emerald-600 uppercase">
                                            {order.payment_status}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* --- BILLING & SHIPPING INFO --- */}
                <div className="mb-10 grid grid-cols-2 gap-8">
                    {/* Billed To */}
                    <div>
                        <h3 className="mb-2 border-b border-gray-200 pb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                            Billed / Shipped To
                        </h3>
                        <p className="text-lg font-bold text-gray-900">{order.recipient_name}</p>
                        <p className="mt-1 text-sm leading-snug text-gray-600">
                            {order.recipient_address_line}
                            <br />
                            {order.recipient_district}, {order.recipient_city}
                            <br />
                            {order.recipient_province} {order.postal_code}
                        </p>
                        <p className="mt-2 text-sm font-medium text-gray-600">
                            Phone: {order.recipient_phone}
                        </p>
                    </div>

                    {/* Shipping Details */}
                    <div>
                        <h3 className="mb-2 border-b border-gray-200 pb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                            Shipping Method
                        </h3>
                        <p className="text-base font-bold text-gray-900 uppercase">
                            {order.shipping_courier_code}
                        </p>
                        <p className="text-sm text-gray-600 uppercase">
                            Service: {order.shipping_courier_service}
                        </p>
                        <p className="text-sm text-gray-600">Weight: {order.shipping_weight}g</p>
                        {order.note && (
                            <div className="mt-3 rounded bg-gray-50 p-2 text-xs text-gray-600">
                                <span className="font-bold uppercase">Note: </span>
                                {order.note}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- ORDER ITEMS TABLE --- */}
                <table className="mb-8 w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-800">
                        <tr>
                            <th className="w-12 px-4 py-3 text-center text-xs font-bold tracking-wider uppercase">
                                No
                            </th>
                            <th className="px-4 py-3 text-xs font-bold tracking-wider uppercase">
                                Item Description
                            </th>
                            <th className="w-20 px-4 py-3 text-center text-xs font-bold tracking-wider uppercase">
                                Qty
                            </th>
                            <th className="w-32 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                                Price
                            </th>
                            <th className="w-36 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {order.items?.map((item, index) => (
                            <tr key={item.id} className="text-gray-700">
                                <td className="px-4 py-4 text-center font-mono text-xs text-gray-500">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-4">
                                    <p className="font-bold text-gray-900">{item.product_name}</p>
                                    <p className="mt-0.5 text-xs text-gray-500 uppercase">
                                        {item.variant_name}
                                    </p>
                                </td>
                                <td className="px-4 py-4 text-center font-semibold">
                                    {item.quantity}
                                </td>
                                <td className="px-4 py-4 text-right tabular-nums">
                                    {formatCurrency(Number(item.price))}
                                </td>
                                <td className="px-4 py-4 text-right font-bold text-gray-900 tabular-nums">
                                    {formatCurrency(Number(item.subtotal))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* --- SUMMARY CALCULATION --- */}
                <div className="flex justify-end">
                    <div className="w-80">
                        <table className="w-full text-sm text-gray-700">
                            <tbody>
                                <tr>
                                    <td className="py-2 pr-4 text-right">Subtotal</td>
                                    <td className="py-2 text-right font-medium tabular-nums">
                                        {formatCurrency(Number(order.subtotal))}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 pr-4 text-right">Shipping Cost</td>
                                    <td className="py-2 text-right font-medium tabular-nums">
                                        {formatCurrency(Number(order.shipping_cost))}
                                    </td>
                                </tr>
                                {Number(order.discount_amount) > 0 && (
                                    <tr>
                                        <td className="py-2 pr-4 text-right text-red-500">
                                            Discount
                                        </td>
                                        <td className="py-2 text-right font-medium text-red-500 tabular-nums">
                                            -{formatCurrency(Number(order.discount_amount))}
                                        </td>
                                    </tr>
                                )}
                                <tr className="border-t-2 border-gray-800 text-lg">
                                    <td className="py-3 pr-4 text-right font-black text-gray-900">
                                        GRAND TOTAL
                                    </td>
                                    <td className="py-3 text-right font-black text-gray-900 tabular-nums">
                                        {formatCurrency(Number(order.grand_total))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="mt-16 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
                    <p className="mb-1 font-semibold text-gray-600">Thank you for your business!</p>
                    <p>
                        If you have any questions about this invoice, please contact us at{' '}
                        {company?.email || 'our email'}{' '}
                        {company?.whatsapp && `or WhatsApp ${company.whatsapp}`}.
                    </p>
                </div>
            </div>
        </div>
    );
}
