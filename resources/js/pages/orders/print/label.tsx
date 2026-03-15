import { CompanyProfile } from '@/types/company-profile';
import { Order } from '@/types/order';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Label({ order, company }: { order: Order; company: CompanyProfile }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 500);

        window.onafterprint = () => {
            window.close();
        };

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen items-start justify-center bg-neutral-200 py-10 print:m-0 print:block print:bg-white print:py-0">
            <Head title={`LABEL - ${order.order_number}`} />

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @page { 
                    /* Gunakan ukuran pasti agar tidak dilarikan ke A4 oleh browser */
                    /* 100mm x 150mm adalah standar kertas resi/thermal printer (A6) */
                    /* Jika kertas thermal Anda berbentuk kotak, ubah ke 100mm 100mm */
                    size: 100mm 150mm; 
                    margin: 0; 
                }
                @media print {
                    html, body {
                        background: #fff;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100mm;
                        height: 150mm;
                    }
                    .print-container { 
                        width: 100mm !important; 
                        height: auto !important; 
                        min-height: unset !important;
                        border: none !important; /* Dihilangkan agar hasil thermal lebih rapi */
                        margin: 0 !important;
                        padding: 5mm !important;
                        box-shadow: none !important;
                    }
                    /* Menghilangkan header/footer otomatis dari browser */
                    header, footer { display: none !important; }
                }
            `,
                }}
            />

            <div className="print-container relative w-[100mm] border-[3px] border-black bg-white p-4 shadow-xl print:border-none print:shadow-none">
                {/* HEADER */}
                <div className="mb-3 flex items-center justify-between border-b-[4px] border-black pb-2">
                    <div className="text-5xl leading-none font-black tracking-tighter uppercase italic">
                        {order.shipping_courier_code}
                    </div>
                    <div className="flex flex-col items-end text-right">
                        <span className="bg-black px-2 py-1 text-xs font-black tracking-widest text-white uppercase">
                            {order.shipping_courier_service}
                        </span>
                        <span className="mt-1 text-[10px] font-bold uppercase">
                            WEIGHT: {order.shipping_weight}G
                        </span>
                    </div>
                </div>

                {/* ORDER REF */}
                <div className="mb-4 border-b-2 border-black pb-3 text-center">
                    <div className="mb-1 font-mono text-[9px] font-bold tracking-[0.4em] text-neutral-400 uppercase">
                        Order Reference
                    </div>
                    <div className="font-mono text-xl font-black tracking-widest uppercase">
                        {order.order_number}
                    </div>
                </div>

                {/* ADDRESS GRID */}
                <div className="grid grid-cols-5 gap-0 border-b-2 border-black pb-3">
                    <div className="col-span-3 border-r-2 border-black pr-2">
                        <p className="mb-1 font-mono text-[9px] font-black text-neutral-400 uppercase italic">
                            Ship To:
                        </p>
                        <p className="mb-1 text-lg leading-none font-black uppercase">
                            {order.recipient_name}
                        </p>
                        <p className="mb-2 text-sm font-bold">{order.recipient_phone}</p>
                        <p className="text-[11px] leading-[1.2] font-medium tracking-tight uppercase">
                            {order.recipient_address_line}
                            <br />
                            {order.recipient_district}, {order.recipient_city}
                            <br />
                            {order.recipient_province} [{order.postal_code}]
                        </p>
                    </div>
                    <div className="col-span-2 pl-3">
                        <p className="mb-1 text-right font-mono text-[9px] font-black text-neutral-400 uppercase italic">
                            From:
                        </p>
                        <p className="mb-1 text-right text-xs leading-tight font-black uppercase">
                            {company.company_name}
                        </p>
                        <p className="mb-2 text-right text-[10px] font-bold">
                            {company.whatsapp || company.phone}
                        </p>
                        <p className="text-right text-[10px] leading-tight text-neutral-600 uppercase">
                            {company.city_name}, {company.province_name}
                        </p>
                    </div>
                </div>

                {/* CONTENTS */}
                <div className="mt-3">
                    <p className="mb-1 font-mono text-[8px] font-black text-neutral-400 uppercase italic">
                        Package Contents:
                    </p>
                    <div className="space-y-0.5 text-[10px] leading-tight font-bold uppercase">
                        {order.items?.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-1 border-b border-neutral-100 pb-0.5"
                            >
                                <span className="shrink-0">{item.quantity}X</span>
                                <span className="truncate">{item.product_name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NOTE */}
                {order.note && (
                    <div className="mt-3 border-2 border-black bg-neutral-50 p-2">
                        <p className="mb-1 font-mono text-[8px] font-black uppercase italic underline">
                            Instructions:
                        </p>
                        <p className="text-[10px] leading-tight font-bold uppercase">
                            {order.note}
                        </p>
                    </div>
                )}

                {/* WATERMARK */}
                <div className="mt-6 flex justify-end opacity-20">
                    <p className="text-2xl leading-none font-black tracking-tighter uppercase italic">
                        {company.company_name}
                    </p>
                </div>
            </div>
        </div>
    );
}
