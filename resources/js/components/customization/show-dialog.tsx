import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomSide, Customization } from '@/types/customization';
import { DialogComponentProps } from '@/types/dialog';
import { Download, Image as ImageIcon, Loader2, Type } from 'lucide-react';
import { useState } from 'react';

export const SIZE_GUIDE_LIST = {
    XS: { label: 'Extra Small', range: '55 - 59 cm', min: 55, max: 59 },
    S: { label: 'Small', range: '60 - 65 cm', min: 60, max: 65 },
    M: { label: 'Medium', range: '66 - 68 cm', min: 66, max: 68 },
    L: { label: 'Large', range: '69 - 71 cm', min: 69, max: 71 },
    XL: { label: 'Extra Large', range: '72 - 75 cm', min: 72, max: 75 },
    XXL: { label: 'Extra Extra Large', range: '76 - 80 cm', min: 76, max: 80 },
} as const;

export type SizeKey = keyof typeof SIZE_GUIDE_LIST;

export const getSizeGuide = (size: string) => {
    const normalized = size.trim().toUpperCase() as SizeKey;

    if (normalized in SIZE_GUIDE_LIST) {
        return SIZE_GUIDE_LIST[normalized].max;
    }

    return 0;
};

export const ShowDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: custom,
}: DialogComponentProps<Customization>) => {
    if (!custom) return null;
    const size = custom.product_variant?.attributes.find((attr) => attr.type == 'size');
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[950px]">
                <DialogHeader>
                    <DialogTitle>Customization Details</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Customer:{' '}
                        <span className="font-semibold text-foreground">{custom.user?.name}</span>
                    </p>
                </DialogHeader>

                <Tabs defaultValue="front" className="mt-2 w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="front" className="relative">
                            Front
                            {custom.custom_details.front.has_design && (
                                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="back" className="relative">
                            Back
                            {custom.custom_details.back.has_design && (
                                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="left" className="relative">
                            Left Sleeve
                            {custom.custom_details.leftSleeve.has_design && (
                                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="right" className="relative">
                            Right Sleeve
                            {custom.custom_details.rightSleeve.has_design && (
                                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="front" className="m-0">
                            <SideDetail
                                side={custom.custom_details.front}
                                name="Front"
                                baseImageUrl={custom.base_images?.front}
                                size={size?.name ?? null}
                            />
                        </TabsContent>
                        <TabsContent value="back" className="m-0">
                            <SideDetail
                                side={custom.custom_details.back}
                                name="Back"
                                baseImageUrl={custom.base_images?.back}
                                size={size?.name ?? null}
                            />
                        </TabsContent>
                        <TabsContent value="left" className="m-0">
                            <SideDetail
                                side={custom.custom_details.leftSleeve}
                                name="Left Sleeve"
                                baseImageUrl={custom.base_images?.leftSleeve}
                                size={size?.name ?? null}
                            />
                        </TabsContent>
                        <TabsContent value="right" className="m-0">
                            <SideDetail
                                side={custom.custom_details.rightSleeve}
                                name="Right Sleeve"
                                baseImageUrl={custom.base_images?.rightSleeve}
                                size={size?.name ?? null}
                            />
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

const LoadedImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/50" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                className={`${className} ${
                    isLoading ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-300 ease-in-out`}
            />
        </>
    );
};

const SideDetail = ({
    side,
    name,
    baseImageUrl,
    size,
}: {
    side: CustomSide;
    name: string;
    baseImageUrl?: string | null;
    size: string | null;
}) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* KIRI: Image / Mockup Section */}
            <div className="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-lg border bg-muted/50 p-2">
                {side.has_design && side.mockup_url ? (
                    <div className="relative flex h-full w-full items-center justify-center">
                        <LoadedImage
                            src={side.mockup_url}
                            alt={`${name} Custom Mockup`}
                            className="h-full w-full rounded-md object-contain drop-shadow-sm"
                        />
                        {/* Tombol Download Mockup Utama */}
                        <a
                            href={side.mockup_url}
                            download={`mockup-${name.toLowerCase().replace(/\s+/g, '-')}.png`}
                            target="_blank"
                            rel="noreferrer"
                            title="Download Full Mockup"
                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                            <Download className="h-4 w-4" />
                        </a>
                    </div>
                ) : baseImageUrl ? (
                    <div className="relative flex h-full w-full flex-col items-center justify-center">
                        <LoadedImage
                            src={baseImageUrl}
                            alt={`${name} Base Product`}
                            className="h-full w-full rounded-md object-contain opacity-70 mix-blend-multiply"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="rounded-full bg-background/90 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                                No Custom Design
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        No image available
                    </div>
                )}
            </div>

            {/* KANAN: Design Elements List */}
            <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold tracking-tight text-foreground">
                        DESIGN ELEMENTS
                    </h4>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {side.design_data?.length || 0} items
                    </span>
                </div>

                {side.has_design && side.design_data && side.design_data.length > 0 ? (
                    <div className="custom-scrollbar max-h-[340px] space-y-3 overflow-y-auto pr-2">
                        {side.design_data.map((el, i) => {
                            const imgSrc = el.src || el.url;

                            // --- LOGIKA ESTIMASI UKURAN CETAK ---
                            // Sesuaikan MOCKUP_SHIRT_HEIGHT_PX dengan ukuran tinggi kanvas pada aplikasi customermu (misal 500px atau 600px)
                            const MOCKUP_SHIRT_HEIGHT_PX = 450;
                            const BASE_SHIRT_LENGTH_CM = size ? getSizeGuide(size) : 70;
                            console.log('SIZE', BASE_SHIRT_LENGTH_CM);
                            // Lebar & Tinggi asli elemen sebelum discaling.
                            // Jika text, ambil fontSize. Jika gambar, ambil width/height. Fallback ke 100px.
                            const baseWidthPx =
                                el.width || (el.type === 'text' ? el.fontSize || 100 : 100);
                            const baseHeightPx =
                                el.height || (el.type === 'text' ? el.fontSize || 100 : 100);

                            const actualWidthPx = baseWidthPx * el.scale;
                            const actualHeightPx = baseHeightPx * el.scale;

                            // Cm conversion
                            const estWidthCm =
                                (actualWidthPx / MOCKUP_SHIRT_HEIGHT_PX) * BASE_SHIRT_LENGTH_CM;
                            const estHeightCm =
                                (actualHeightPx / MOCKUP_SHIRT_HEIGHT_PX) * BASE_SHIRT_LENGTH_CM;

                            return (
                                <div
                                    key={i}
                                    className="rounded-lg border bg-card p-3.5 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="mb-3 flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            {el.type === 'text' ? (
                                                <Type className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-emerald-500" />
                                            )}
                                            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                                                {el.type}
                                            </span>
                                        </div>
                                        <span className="font-mono text-[10px] text-muted-foreground">
                                            {el.id}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                        {/* TEXT Element Detail */}
                                        {el.type === 'text' && (
                                            <>
                                                <div className="flex items-start justify-between">
                                                    <span className="text-muted-foreground">
                                                        Text:
                                                    </span>
                                                    <span className="max-w-[180px] text-right font-semibold break-words">
                                                        "{el.text}"
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">
                                                        Font:
                                                    </span>
                                                    <span className="font-medium">
                                                        {el.fontFamily}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-muted-foreground">
                                                        Color:
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-3.5 w-3.5 rounded-full border shadow-sm"
                                                            style={{ backgroundColor: el.fill }}
                                                        />
                                                        <span className="font-medium uppercase">
                                                            {el.fill}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* IMAGE Element Detail */}
                                        {el.type === 'image' && (
                                            <>
                                                <div className="flex items-center justify-between rounded-md border bg-muted/50 p-2">
                                                    <div className="flex flex-col gap-1 overflow-hidden">
                                                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                                            Source File
                                                        </span>
                                                        <span className="max-w-[140px] truncate font-mono text-primary">
                                                            {imgSrc?.split('/').pop() ||
                                                                'image_asset'}
                                                        </span>
                                                    </div>

                                                    {imgSrc && (
                                                        <a
                                                            href={imgSrc}
                                                            download={`asset-${el.id}.jpg`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="Download Raw Asset"
                                                            className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            <span className="text-[10px] font-medium">
                                                                Save
                                                            </span>
                                                        </a>
                                                    )}
                                                </div>
                                                {el.width && el.height ? (
                                                    <div className="flex justify-between pt-1">
                                                        <span className="text-muted-foreground">
                                                            Original Size:
                                                        </span>
                                                        <span className="font-medium">
                                                            {Math.round(el.width)} ×{' '}
                                                            {Math.round(el.height)} px
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </>
                                        )}

                                        <div className="mt-2 flex flex-col gap-1.5 border-t pt-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Coord / Transform:
                                                </span>
                                                <span className="font-medium">
                                                    X:{Math.round(el.x)} Y:{Math.round(el.y)} |{' '}
                                                    {el.scale}x / {el.rotation}°
                                                </span>
                                            </div>

                                            <div className="mt-1 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-amber-800">
                                                <span className="font-medium">
                                                    📏 Est. Print Size:
                                                </span>
                                                <span className="font-bold">
                                                    ~{estWidthCm.toFixed(1)} cm ×{' '}
                                                    {estHeightCm.toFixed(1)} cm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                        <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                            No Elements Added
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/70">
                            Customer left this side blank.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
);
