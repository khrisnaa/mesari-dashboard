import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
// import { Color } from '@/pages/products/create';
import { Attribute } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { useEffect, useMemo, useState } from 'react';

type Variant = {
    id: string;
    size: Attribute;
    color?: Attribute;
};

interface VariantResult {
    size: Attribute;
    color?: Attribute;
    price: number;
    stock: number;
}

interface PricesDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onSubmit: (data: VariantResult[]) => void;
    sizes: Attribute[];
    colors: Attribute[];
    basePriceProp?: string;
    baseStockProp?: string;
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
    basePriceProp,
    baseStockProp,
}: PricesDialogProps) => {
    // Generate combinations
    const variants = useMemo<Variant[]>(() => {
        if (colors.length == 0) {
            return sizes.map((size) => ({
                id: `size-${size.name}`,
                size,
            }));
        }

        return sizes.flatMap((size) =>
            colors.map((color) => ({
                id: `${size.name}-${color.name}`,
                size,
                color,
            })),
        );
    }, [colors, sizes]);

    useEffect(() => {
        if (basePriceProp !== undefined && basePriceProp !== null) {
            setBasePrice(String(basePriceProp));
        }
        if (baseStockProp !== undefined && baseStockProp !== null) {
            setBaseStock(String(baseStockProp));
        }
    }, [basePriceProp, baseStockProp]);

    const [basePrice, setBasePrice] = useState<string>(basePriceProp ?? '');
    const [baseStock, setBaseStock] = useState<string>(baseStockProp || '');
    const [variantValues, setVariantValues] = useState<VariantValueState>({});

    const handleVariantChange = (id: string, field: 'price' | 'stock', value: number) => {
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

    useEffect(() => {
        handleSave();
    }, [basePriceProp, baseStockProp]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="sm:max-w-xl"
            >
                <DialogHeader>
                    <DialogTitle>Pricing and Stock</DialogTitle>
                </DialogHeader>
                <DialogDescription hidden>
                    Dialog for adding price and stock to product variants
                </DialogDescription>
                <div className="flex flex-col gap-4 py-6">
                    <div className="grid h-fit grid-cols-2 gap-4">
                        <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Rp 0"
                                    inputMode="numeric"
                                    value={formatNumber(basePrice)}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setBasePrice(numericValue.toString());
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                        <FormItem>
                            <FormLabel>Base Stock</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="0"
                                    inputMode="numeric"
                                    value={formatNumber(baseStock)}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        setBaseStock(numericValue.toString());
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
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
                                const isPriceFilled = !!variantValues[variant.id]?.price;
                                const isStockFilled = !!variantValues[variant.id]?.stock;

                                return (
                                    <div key={i} className="grid h-fit grid-cols-5 gap-4">
                                        <div className="col-span-1 flex items-center gap-2">
                                            {variant.color && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            style={{
                                                                backgroundColor:
                                                                    variant.color.hex ??
                                                                    '#fff',
                                                            }}
                                                            className="aspect-square h-5 rounded-full border"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{variant.color.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}

                                            <h4>{variant.size.name}</h4>
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder={
                                                    formatNumber(basePrice) || '0'
                                                }
                                                value={formatNumber(
                                                    variantValues[variant.id]?.price,
                                                )}
                                                onChange={(e) => {
                                                    const numericValue = parseNumber(
                                                        e.target.value,
                                                    );

                                                    handleVariantChange(
                                                        variant.id,
                                                        'price',
                                                        numericValue,
                                                    );
                                                }}
                                                className={`h-9 pr-3 text-right ${!isPriceFilled && basePrice ? 'text-neutral-400' : 'text-neutral-900'}`}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder={baseStock || '0'}
                                                value={formatNumber(
                                                    variantValues[variant.id]?.stock,
                                                )}
                                                onChange={(e) => {
                                                    const numericValue = parseNumber(
                                                        e.target.value,
                                                    );

                                                    handleVariantChange(
                                                        variant.id,
                                                        'stock',
                                                        numericValue,
                                                    );
                                                }}
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
