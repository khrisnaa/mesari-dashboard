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
    isEdit?: boolean;
}

const PricingForm = ({ open, onOpenChange, colors, sizes, isEdit }: PricingFormProps) => {
    const form = useFormContext();

    const parentBasePrice = form.watch('base_price');
    const parentBaseStock = form.watch('base_stock');

    const [basePrice, setBasePrice] = useState<number | null>(parentBasePrice);
    const [baseStock, setBaseStock] = useState<number | null>(parentBaseStock);

    useEffect(() => {
        if (open) {
            setBasePrice(parentBasePrice);
            setBaseStock(parentBaseStock);
        }
    }, [open, parentBasePrice, parentBaseStock]);

    const baseVariants: Variant[] = form.watch('variants');
    const [variants, setVariants] = useState<Variant[] | []>(baseVariants || []);

    const generateCombinations = () => {
        if (colors.length === 0) {
            return sizes.map((size) => ({
                size: { name: size.name, id: size.id, hex: size.hex ?? null },
                price: 0,
                stock: 0,
            }));
        }

        return sizes.flatMap((size) =>
            colors.map((color) => ({
                size: { name: size.name, id: size.id, hex: size.hex ?? null },
                color: { name: color.name, id: color.id, hex: color.hex ?? null },
                price: 0,
                stock: 0,
            })),
        );
    };

    const namesMatch = (name1?: string, name2?: string): boolean => {
        return name1?.trim().toLowerCase() === name2?.trim().toLowerCase();
    };

    useEffect(() => {
        const combinations: Variant[] = generateCombinations();
        setVariants((prev) => {
            const stillValid = prev.filter((v) => {
                const sizeExists = sizes.some(
                    (s) => s.name.trim().toLowerCase() === v.size?.name.trim().toLowerCase(),
                );

                if (colors.length === 0) {
                    return sizeExists && !v.color;
                }

                const colorExists = colors.some(
                    (c) => c.name.trim().toLowerCase() === v.color?.name?.trim().toLowerCase(),
                );

                return sizeExists && colorExists;
            });

            const newVariants = combinations
                .filter((comb) => {
                    return !stillValid.some((v) => {
                        const sizeMatch = namesMatch(v.size?.name, comb.size?.name);
                        const colorMatch = namesMatch(v.color?.name, comb.color?.name);
                        return sizeMatch && colorMatch;
                    });
                })
                .map((comb) => {
                    const existingInBase = baseVariants?.find((base) => {
                        const sizeMatch = namesMatch(base.size?.name, comb.size?.name);
                        const colorMatch = namesMatch(base.color?.name, comb.color?.name);
                        return sizeMatch && colorMatch;
                    });

                    return existingInBase
                        ? {
                              ...comb,
                              price: existingInBase.price ?? basePrice,
                              stock: existingInBase.stock ?? baseStock,
                              isPriceAuto: true,
                              isStockAuto: true,
                          }
                        : {
                              ...comb,
                              price: basePrice ?? comb.price,
                              stock: baseStock ?? comb.stock,
                              isPriceAuto: true,
                              isStockAuto: true,
                          };
                });

            return [...stillValid, ...newVariants];
        });
    }, [colors, sizes, baseVariants]);

    useEffect(() => {
        if (basePrice === null && baseStock === null) return;

        setVariants((prev) =>
            prev.map((variant) => ({
                ...variant,
                price: variant.isPriceAuto ? (basePrice ?? variant.price) : variant.price,
                stock: variant.isStockAuto ? (baseStock ?? variant.stock) : variant.stock,
            })),
        );
    }, [basePrice, baseStock]);

    const handleResetVariantsToDefault = () => {
        setVariants((prev) =>
            prev.map((variant) => {
                const baseVariant = baseVariants?.find((base) => {
                    const sizeMatch = namesMatch(base.size?.name, variant.size?.name);
                    const colorMatch = namesMatch(base.color?.name, variant.color?.name);
                    return sizeMatch && colorMatch;
                });

                const hasBaseVariantDefault =
                    baseVariant?.price !== undefined || baseVariant?.stock !== undefined;

                return {
                    ...variant,
                    price: baseVariant?.price ?? basePrice ?? variant.price,
                    stock: baseVariant?.stock ?? baseStock ?? variant.stock,
                    isPriceAuto: hasBaseVariantDefault ? false : true,
                    isStockAuto: hasBaseVariantDefault ? false : true,
                };
            }),
        );
    };

    const handleSave = () => {
        form.setValue('base_price', basePrice);
        form.setValue('base_stock', baseStock);

        const finalData: Variant[] = variants.map((variant) => ({
            color: variant.color,
            size: variant.size,
            price: variant.price,
            stock: variant.stock,
        }));

        form.setValue('variants', finalData);
    };

    const handleBulkSave = () => {
        form.setValue('base_price', basePrice);
        form.setValue('base_stock', baseStock);

        const updated = variants.map((v) => ({
            ...v,
            price: basePrice ?? 0,
            stock: baseStock ?? 0,
        }));

        setVariants(updated);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                onOpenChange(false);
                handleResetVariantsToDefault();
            }}
        >
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
                        {isEdit && (
                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleBulkSave} className="rounded-full">
                                    Apply for all
                                </Button>
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="custom-scrollbar flex h-[50dvh] flex-col justify-between gap-4 overflow-y-auto pr-4">
                        <div className="grid gap-4">
                            <div className="grid h-fit grid-cols-5 gap-4">
                                <Label>Variant</Label>
                                <Label className="col-span-2">Pricing</Label>
                                <Label className="col-span-2">Stock</Label>
                            </div>
                            {/* Variants mapp */}
                            {variants.map((variant, i) => {
                                return (
                                    <div key={i} className="grid h-fit grid-cols-5 gap-4">
                                        <div className="col-span-1 flex items-center gap-2">
                                            {variant.color && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            style={{
                                                                backgroundColor:
                                                                    variant.color.hex ?? '#fff',
                                                            }}
                                                            className="aspect-square h-5 rounded-full border"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{variant.color.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            )}
                                            <h4>{variant?.size?.name}</h4>
                                        </div>
                                        <div className="col-span-2">
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
                                                        prev.map((v, idx) =>
                                                            idx === i
                                                                ? {
                                                                      ...v,
                                                                      price: numericValue,
                                                                      isPriceAuto: false,
                                                                  }
                                                                : v,
                                                        ),
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2">
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
                                                        prev.map((v, idx) =>
                                                            idx === i
                                                                ? {
                                                                      ...v,
                                                                      stock: numericValue,
                                                                      isStockAuto: false,
                                                                  }
                                                                : v,
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
                                onClick={handleResetVariantsToDefault}
                            >
                                Reset
                            </Button>
                            <Button
                                size="lg"
                                className="rounded-full"
                                onClick={() => {
                                    handleSave();
                                    onOpenChange(false);
                                }}
                            >
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
