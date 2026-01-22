import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';
import { Attribute } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface Variant {
    size?: Attribute;
    color?: Attribute;
    price: number;
    stock: number;
    isPriceAuto?: boolean;
    isStockAuto?: boolean;
}

interface PricingFormProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    sizes: Attribute[];
    colors: Attribute[];
    differentPricing?: boolean;
    onDifferentPricing?: (value: boolean) => void;
}

// helper
const namesMatch = (a?: string, b?: string) => a?.trim().toLowerCase() === b?.trim().toLowerCase();

const normalize = (v?: string) => v?.trim().toLowerCase() ?? '';

const getKey = (v: Variant) => `${normalize(v.size?.name)}::${normalize(v.color?.name)}`;

const dedupe = (list: Variant[]) => {
    const map = new Map<string, Variant>();
    list.forEach((v) => map.set(getKey(v), v));
    return Array.from(map.values());
};

const PricingForm = ({
    open,
    onOpenChange,
    colors,
    sizes,
    differentPricing,
    onDifferentPricing,
}: PricingFormProps) => {
    const form = useFormContext();

    // base states
    const [initialVariants, setInitialVariants] = useState<Variant[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

    const [basePrice, setBasePrice] = useState<number | null>(null);
    const [baseStock, setBaseStock] = useState<number | null>(null);

    // generate combinations
    const generateCombinations = (): Variant[] => {
        if (colors.length === 0) {
            return sizes.map((s) => ({
                size: { ...s },
                price: 0,
                stock: 0,
            }));
        }

        return sizes.flatMap((s) =>
            colors.map((c) => ({
                size: { ...s },
                color: { ...c },
                price: 0,
                stock: 0,
            })),
        );
    };

    // load snapshot
    useEffect(() => {
        if (open) {
            const snapshot = form.getValues('variants') ?? [];

            const unique = dedupe(snapshot);
            setInitialVariants(unique);
            setVariants(unique);
            setSelectedVariants([]);
        }
    }, [open]);

    // update variants
    useEffect(() => {
        if (!open) return;

        const combinations = generateCombinations();

        setVariants((prev) => {
            // const valid = prev.filter((v) => {
            //     const sizeExists = sizes.some((s) => namesMatch(s.name, v.size?.name));

            //     if (!sizeExists) return false;

            //     if (colors.length === 0) return !v.color;

            //     const colorExists = colors.some((c) => namesMatch(c.name, v.color?.name));

            //     return colorExists;
            // });

            const valid = prev.filter((v) => {
                const sizeExists = sizes.some((s) => namesMatch(s.name, v.size?.name));
                const colorExists = v.color
                    ? colors.some((c) => namesMatch(c.name, v.color?.name))
                    : true;

                return sizeExists && colorExists;
            });

            const map = new Map<string, Variant>();
            valid.forEach((v) => map.set(getKey(v), v));

            combinations.forEach((co) => {
                const key = getKey(co);
                if (!map.has(key)) {
                    map.set(key, {
                        ...co,
                        price: basePrice ?? 0,
                        stock: baseStock ?? 0,
                        isPriceAuto: true,
                        isStockAuto: true,
                    });
                }
            });

            return dedupe(Array.from(map.values()));
        });
    }, [sizes, colors, open]);

    // bulk apply
    const handleBulkApplyPrice = () => {
        const updated = variants.map((v) => {
            const key = getKey(v);
            const allow = selectedVariants.length === 0 || selectedVariants.includes(key);

            return allow ? { ...v, price: basePrice ?? 0, isPriceAuto: true } : v;
        });

        setVariants(updated);
    };

    const handleBulkApplyStock = () => {
        const updated = variants.map((v) => {
            const key = getKey(v);
            const allow = selectedVariants.length === 0 || selectedVariants.includes(key);

            return allow ? { ...v, stock: baseStock ?? 0, isStockAuto: true } : v;
        });

        setVariants(updated);
    };

    // reset handler (reset price & stock only)
    const handleReset = () => {
        setVariants((prev) =>
            prev.map((v) => {
                const match = initialVariants.find(
                    (iv) =>
                        namesMatch(iv.size?.name, v.size?.name) &&
                        namesMatch(iv.color?.name, v.color?.name),
                );

                return {
                    ...v,
                    price: match?.price ?? 0,
                    stock: match?.stock ?? 0,
                    isPriceAuto: true,
                    isStockAuto: true,
                };
            }),
        );

        setSelectedVariants([]);
    };

    // save
    const handleSave = () => {
        const unique = dedupe(variants);

        form.setValue('variants', unique, { shouldDirty: true });
        handleClose();
        onDifferentPricing?.(true);
    };

    const handleClose = () => {
        onOpenChange(false);
        setBasePrice(null);
        setBaseStock(null);
    };

    const baseParentPrice = form.watch('base_price');
    const baseParentStock = form.watch('base_stock');

    const handleSimplePricing = () => {
        const combinations = generateCombinations();

        const finalData: Variant[] = combinations.map((v) => ({
            size: {
                id: v.size?.id ?? '',
                name: v.size?.name ?? '',
                hex: v.size?.hex ?? null,
            },
            color: v.color ? { ...v.color } : undefined,
            price: baseParentPrice ?? 0,
            stock: baseParentStock ?? 0,
        }));

        form.setValue('variants', finalData, { shouldDirty: true });
    };

    useEffect(() => {
        if (!differentPricing && !open) {
            handleSimplePricing();
        }
    }, [baseParentPrice, baseParentStock, sizes, colors]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Pricing and Stock</DialogTitle>
                </DialogHeader>
                <DialogDescription hidden>
                    Dialog for adding price and stock to product variants
                </DialogDescription>
                <div className="flex flex-col gap-4 py-6">
                    <div>
                        <div className="grid h-fit grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="0"
                                        inputMode="numeric"
                                        value={formatNumber(basePrice?.toString())}
                                        onChange={(e) => {
                                            const numericValue = parseNumber(e.target.value);
                                            setBasePrice(numericValue);
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
                                        value={formatNumber(baseStock?.toString())}
                                        onChange={(e) => {
                                            const numericValue = parseNumber(e.target.value);
                                            setBaseStock(numericValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>

                        <div className="mt-4 flex justify-end gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-xs"
                                onClick={handleBulkApplyPrice}
                            >
                                Apply Price
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-xs"
                                onClick={handleBulkApplyStock}
                            >
                                Apply Stock
                            </Button>
                        </div>
                    </div>
                    <Separator />
                    <div className="custom-scrollbar flex h-[50dvh] flex-col justify-between gap-4 overflow-y-auto pr-4">
                        <div className="grid gap-4">
                            <div className="grid h-fit grid-cols-10 gap-4">
                                <Label>#</Label>
                                <Label className="col-span-3">Variant</Label>
                                <Label className="col-span-3">Pricing</Label>
                                <Label className="col-span-3">Stock</Label>
                            </div>
                            {/* Variants mapp */}
                            {variants.map((variant, i) => {
                                return (
                                    <div
                                        key={getKey(variant)}
                                        className="grid h-fit grid-cols-10 gap-4"
                                    >
                                        <div>
                                            <Checkbox
                                                className="border-neutral-500"
                                                checked={selectedVariants.includes(getKey(variant))}
                                                onCheckedChange={(checked) => {
                                                    setSelectedVariants((prev) =>
                                                        checked
                                                            ? [...prev, getKey(variant)]
                                                            : prev.filter(
                                                                  (id) => id !== getKey(variant),
                                                              ),
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3 flex items-center gap-2">
                                            {variant.color && (
                                                <div
                                                    className="h-4 w-4 rounded-full border border-neutral-500"
                                                    style={{
                                                        backgroundColor:
                                                            variant.color.hex ?? '#fff',
                                                    }}
                                                />
                                            )}

                                            <span className="text-sm font-medium">
                                                {variant.size?.name}
                                                {variant.color ? ` / ${variant.color.name}` : ''}
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                className="h-9 pr-3 text-right text-neutral-900"
                                                value={formatNumber(
                                                    (variant.price ?? basePrice ?? 0).toString(),
                                                )}
                                                onChange={(e) => {
                                                    const numericValue = parseNumber(
                                                        e.target.value,
                                                    );

                                                    setVariants((prev) =>
                                                        dedupe(
                                                            prev.map((v, idx) =>
                                                                idx === i
                                                                    ? {
                                                                          ...v,
                                                                          price: numericValue,
                                                                          isPriceAuto: false,
                                                                      }
                                                                    : v,
                                                            ),
                                                        ),
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                type="text"
                                                inputMode="numeric"
                                                className={cn(
                                                    'h-9 pr-3 text-right text-neutral-900',
                                                )}
                                                value={formatNumber(
                                                    (variant.stock ?? baseStock ?? 0).toString(),
                                                )}
                                                onChange={(e) => {
                                                    const numericValue = parseNumber(
                                                        e.target.value,
                                                    );

                                                    setVariants((prev) =>
                                                        dedupe(
                                                            prev.map((v, idx) =>
                                                                idx === i
                                                                    ? {
                                                                          ...v,
                                                                          stock: numericValue,
                                                                          isStockAuto: false,
                                                                      }
                                                                    : v,
                                                            ),
                                                        ),
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                            <Button size="lg" className="rounded-full" onClick={handleSave}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
export default PricingForm;
