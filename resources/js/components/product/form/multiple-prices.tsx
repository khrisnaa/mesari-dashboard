import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Color } from '@/pages/products/create';
import { Attribute } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface VariantResult {
    size: Attribute;
    color: Color;
    price: number;
    stock: number;
}

interface PricesDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onSubmit: (data: VariantResult[]) => void;
    colors: Color[];
    sizes: Attribute[];
}

interface VariantValueState {
    [key: string]: {
        price: string;
        stock: string;
    };
}

export const MultiplePricesDialog = ({
    open,
    onOpenChange,
    onSubmit,
    colors,
    sizes,
}: PricesDialogProps) => {
    // Generate combinations
    const variants = useMemo(() => {
        return sizes.flatMap((size) =>
            colors.map((color) => ({
                id: `${size}-${color.name}`,
                size,
                color,
            })),
        );
    }, [colors, sizes]);

    const form = useFormContext();

    const [basePrice, setBasePrice] = useState<string>('');
    const [baseStock, setBaseStock] = useState<string>('');
    const [variantValues, setVariantValues] = useState<VariantValueState>({});

    // Reset when opening
    useEffect(() => {
        if (!open) {
            // Optional: Reset logic if needed
        }
    }, [open]);

    const handleVariantChange = (
        id: string,
        field: 'price' | 'stock',
        value: string,
    ) => {
        const formattedValue = formatNumber(value);
        setVariantValues((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || { price: '', stock: '' }),
                [field]: formattedValue,
            },
        }));
    };

    const handleSave = () => {
        const finalData: VariantResult[] = variants.map((variant) => {
            const specificValues = variantValues[variant.id];

            const rawPrice = specificValues?.price
                ? parseNumber(specificValues.price)
                : parseNumber(basePrice);

            const rawStock = specificValues?.stock
                ? parseNumber(specificValues.stock)
                : parseNumber(baseStock);

            return {
                size: variant.size,
                color: variant.color,
                price: rawPrice,
                stock: rawStock,
            };
        });

        onSubmit(finalData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Pricing and Stock</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-6">
                    <div className="grid h-fit grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="base_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Rp 0"
                                            {...field}
                                            inputMode="numeric"
                                            value={
                                                field.value
                                                    ? formatNumber(
                                                          String(field.value),
                                                      )
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                field.onChange(
                                                    parseNumber(e.target.value),
                                                );
                                                setBasePrice(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="base_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Base Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="0"
                                            {...field}
                                            inputMode="numeric"
                                            value={
                                                field.value
                                                    ? formatNumber(
                                                          String(field.value),
                                                      )
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                field.onChange(
                                                    parseNumber(e.target.value),
                                                );
                                                setBaseStock(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Separator />
                    <div className="custom-scrollbar flex h-[50dvh] flex-col justify-between gap-4 overflow-y-auto pr-4">
                        <div className="grid gap-4">
                            <div className="grid h-fit grid-cols-5 gap-4">
                                <Label>Variant</Label>
                                <Label className="col-span-2">Pricing</Label>
                                <Label className="col-span-2">Stock</Label>
                            </div>
                            {variants.map((variant, i) => {
                                const isPriceFilled =
                                    !!variantValues[variant.id]?.price;
                                const isStockFilled =
                                    !!variantValues[variant.id]?.stock;

                                return (
                                    <div
                                        key={i}
                                        className="grid h-fit grid-cols-5 gap-4"
                                    >
                                        <div className="col-span-1 flex items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                variant.color
                                                                    .hex,
                                                        }}
                                                        className="aspect-square h-5 rounded-full border"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{variant.color.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <h4>{variant.size.name}</h4>
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder={basePrice || '0'}
                                                value={
                                                    variantValues[variant.id]
                                                        ?.price || ''
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variant.id,
                                                        'price',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-9 pr-3 text-right ${!isPriceFilled && basePrice ? 'text-neutral-400' : 'text-neutral-900'}`}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder={baseStock || '0'}
                                                value={
                                                    variantValues[variant.id]
                                                        ?.stock || ''
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variant.id,
                                                        'stock',
                                                        e.target.value,
                                                    )
                                                }
                                                className={`h-9 pr-3 text-right ${!isStockFilled && baseStock ? 'text-neutral-400' : 'text-neutral-900'}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                size="lg"
                                onClick={() => onOpenChange(false)}
                                variant="outline"
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                size="lg"
                                className="rounded-full"
                            >
                                Save Prices
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
