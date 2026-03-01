import { CompanyProfile } from '@/types/company-profile';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Label({ order, company }: { order: Order; company: CompanyProfile }) {
    useEffect(() => {
        window.print();
        window.onafterprint = () => {
            window.close();
        };
    }, []);

    return (
        <div className="flex min-h-screen justify-center bg-white py-8 print:py-0">
            <Head title={`Label - ${order.order_number}`} />

            <div className="relative w-[400px] max-w-[10cm] border-2 border-black bg-white p-4 print:w-full print:border-none print:p-0">
                {/* Header Expedisi */}
                <div className="mb-3 flex items-center justify-between border-b-2 border-black pb-3">
                    <div className="text-3xl font-black tracking-tighter uppercase">
                        {order.shipping_courier_code}
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold uppercase">
                            {order.shipping_courier_service}
                        </div>
                        <div className="text-sm font-semibold">{order.shipping_weight} gr</div>
                    </div>
                </div>

                {/* Nomor Resi / Order */}
                <div className="mb-4 text-center">
                    <p className="mb-1 text-xs font-semibold tracking-widest text-gray-500 uppercase">
                        Nomor Pesanan
                    </p>
                    <div className="border-y-2 border-black py-2 font-mono text-lg font-bold tracking-widest">
                        {order.order_number}
                    </div>
                </div>

                {/* Detail Penerima */}
                <div className="mb-4">
                    <p className="mb-1 text-xs font-bold uppercase">Penerima:</p>
                    <p className="text-base leading-tight font-bold">{order.recipient_name}</p>
                    <p className="text-sm font-bold">{order.recipient_phone}</p>
                    <p className="mt-1 text-sm leading-snug">
                        {order.recipient_address_line}
                        <br />
                        {order.recipient_district}, {order.recipient_city}
                        <br />
                        {order.recipient_province} {order.postal_code}
                    </p>
                </div>

                {/* Detail Pengirim (MENGGUNAKAN DATA COMPANY) */}
                <div className="mb-4 border-t-2 border-dashed border-gray-400 pt-3">
                    <p className="mb-1 text-xs font-bold uppercase">Pengirim:</p>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-bold">
                                {company?.company_name || 'Your Store'}
                            </p>
                            <p className="text-xs">
                                {company?.city || 'City'}, {company?.province || 'Province'}
                            </p>
                        </div>
                        <p className="text-sm font-bold">
                            {company?.whatsapp || company?.phone || '08xx-xxxx-xxxx'}
                        </p>
                    </div>
                </div>

                {/* Ringkasan Isi Paket */}
                <div className="border-t-2 border-black pt-3">
                    <p className="mb-1 text-xs font-bold uppercase">Isi Paket:</p>
                    <ul className="list-disc space-y-1 pl-4 text-xs">
                        {order.items?.map((item) => (
                            <li key={item.id}>
                                <span className="font-semibold">{item.quantity}x</span>{' '}
                                {item.product_name} - {item.variant_name}
                            </li>
                        ))}
                    </ul>
                    {order.note && (
                        <div className="mt-2 border border-gray-300 p-2 text-xs italic">
                            <span className="font-bold not-italic">Catatan:</span> {order.note}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
