import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { VariantAttribute } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { TrashIcon } from 'lucide-react';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export interface Variant {
    size?: VariantAttribute;
    color?: VariantAttribute;
    price: number;
    stock: number;
    isPriceAuto?: boolean;
    isStockAuto?: boolean;
    isBaseParentAuto?: boolean;
}

interface PricingFormProps {
    sizes: VariantAttribute[];
    colors: VariantAttribute[];
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

const PricingForm = ({ colors, sizes }: PricingFormProps) => {
    const form = useFormContext();

    // base states
    const [initialVariants, setInitialVariants] = useState<Variant[]>([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

    // MEMORI BLACKLIST: Mencatat kombinasi yang dihapus/tidak ada di DB
    const [deletedKeys, setDeletedKeys] = useState<string[]>([]);
    const [hasInitializedBlacklist, setHasInitializedBlacklist] = useState(false);

    // Convert arrays to string to prevent infinite loops
    const sizesStr = JSON.stringify(sizes);
    const colorsStr = JSON.stringify(colors);
    const variantsStr = JSON.stringify(variants);

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

    // GENERATE & RECONCILE LOGIC
    useEffect(() => {
        const combinations = generateCombinations();
        const possibleKeys = combinations.map(getKey);
        const formVariants = form.getValues('variants') ?? [];

        let currentBlacklist = deletedKeys;
        let dbData = initialVariants;

        // 1. INISIALISASI BLACKLIST (Hanya jalan sekali saat load data API)
        if (!hasInitializedBlacklist && formVariants.length > 0) {
            const dbKeys = formVariants.map(getKey);
            // Cari kombinasi yang harusnya ada tapi ga ada di DB (berarti dulu dihapus)
            const missingFromDb = possibleKeys.filter((k) => !dbKeys.includes(k));

            currentBlacklist = missingFromDb;
            setDeletedKeys(currentBlacklist);

            dbData = formVariants;
            setInitialVariants(formVariants);
            setHasInitializedBlacklist(true);
        }

        // 2. CLEANSING BLACKLIST (Syarat: Kalau tombol color/size di-uncheck lalu dicheck lagi)
        // Kita hanya menyimpan deletedKey yang masih mungkin dibuat (ada di possibleKeys)
        const activeDeletedKeys = currentBlacklist.filter((k) => possibleKeys.includes(k));
        if (hasInitializedBlacklist && activeDeletedKeys.length !== deletedKeys.length) {
            setDeletedKeys(activeDeletedKeys);
        }

        setVariants((prev) => {
            const newVariants: Variant[] = [];

            combinations.forEach((co) => {
                const key = getKey(co);

                const inPrev = prev.find((v) => getKey(v) === key);
                const inDb = dbData.find((v: Variant) => getKey(v) === key);

                // --- LOGIKA UTAMA: CEK BLACKLIST ---
                // Jika varian ini tidak sedang tampil (inPrev) DAN ada di daftar blacklist, SKIP!
                if (!inPrev && activeDeletedKeys.includes(key)) {
                    return;
                }

                // Recovery data DB jika sempat ter-reset karena delay render
                if (
                    inDb &&
                    inPrev &&
                    inPrev.price === 0 &&
                    inPrev.stock === 0 &&
                    (inDb.price > 0 || inDb.stock > 0)
                ) {
                    newVariants.push(inDb);
                    return;
                }

                // Pakai data Database
                if (inDb && !inPrev) {
                    newVariants.push(inDb);
                    return;
                }

                // Pertahankan ketikan aktif form
                if (inPrev) {
                    newVariants.push(inPrev);
                    return;
                }

                // Varian benar-benar baru digenerate
                newVariants.push({
                    ...co,
                    price: form.getValues('base_price') ?? 0,
                    stock: form.getValues('base_stock') ?? 0,
                    isPriceAuto: true,
                    isStockAuto: true,
                });
            });

            return dedupe(newVariants);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sizesStr, colorsStr]);

    // AUTO-SAVE EFFECT
    useEffect(() => {
        const currentVariants: Variant[] = JSON.parse(variantsStr);

        // Guard mencegah wipeout data saat initial load
        if (sizes.length === 0 && colors.length === 0 && currentVariants.length === 0) {
            return;
        }

        const unique = dedupe(currentVariants);
        form.setValue('variants', unique, { shouldDirty: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variantsStr]);

    // bulk apply functions
    const handleBulkApplyPrice = () => {
        const currentBasePrice = form.getValues('base_price') ?? 0;
        const updated = variants.map((v) => {
            const key = getKey(v);
            const allow = selectedVariants.length === 0 || selectedVariants.includes(key);
            return allow ? { ...v, price: currentBasePrice, isPriceAuto: true } : v;
        });
        setVariants(updated);
    };

    const handleBulkApplyStock = () => {
        const currentBaseStock = form.getValues('base_stock') ?? 0;
        const updated = variants.map((v) => {
            const key = getKey(v);
            const allow = selectedVariants.length === 0 || selectedVariants.includes(key);
            return allow ? { ...v, stock: currentBaseStock, isStockAuto: true } : v;
        });
        setVariants(updated);
    };

    // FUNGSI HAPUS: Hapus baris DAN masukkan ke Blacklist
    const handleRemove = (variant: Variant) => {
        const keyToRemove = getKey(variant);

        setVariants((prev) => prev.filter((v) => getKey(v) !== keyToRemove));

        // Ingat key ini agar tidak digenerate ulang
        setDeletedKeys((prev) => {
            if (!prev.includes(keyToRemove)) {
                return [...prev, keyToRemove];
            }
            return prev;
        });
    };

    const hasVariants = variants.length > 0;

    return (
        <div className="flex flex-col gap-4">
            {/* Base Price & Base Stock */}
            <div className="grid h-fit grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="base_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="0"
                                    inputMode="numeric"
                                    {...field}
                                    value={formatNumber(field.value?.toString())}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        field.onChange(numericValue);
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
                                    inputMode="numeric"
                                    {...field}
                                    value={formatNumber(field.value?.toString())}
                                    onChange={(e) => {
                                        const numericValue = parseNumber(e.target.value);
                                        field.onChange(numericValue);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Variants Section */}
            {hasVariants && (
                <>
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="rounded-full text-xs"
                            onClick={handleBulkApplyPrice}
                        >
                            Apply Price
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="rounded-full text-xs"
                            onClick={handleBulkApplyStock}
                        >
                            Apply Stock
                        </Button>
                    </div>

                    <Separator />

                    <div className="custom-scrollbar flex max-h-[50dvh] flex-col justify-between gap-4 overflow-y-auto pr-2">
                        <div className="grid gap-4">
                            <div className="grid h-fit grid-cols-11 items-center gap-4">
                                <Label>#</Label>
                                <Label className="col-span-3">Variant</Label>
                                <Label className="col-span-3">Pricing</Label>
                                <Label className="col-span-3">Stock</Label>
                                <Label className="col-span-1"></Label>
                            </div>

                            {/* Variants map */}
                            {variants.map((variant, i) => {
                                return (
                                    <div
                                        key={getKey(variant)}
                                        className="grid h-fit grid-cols-11 items-center gap-4"
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
                                                    (variant.price ?? 0).toString(),
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
                                                    (variant.stock ?? 0).toString(),
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
                                        <div className="col-span-1 flex justify-end">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                type="button"
                                                className="h-8 w-8 text-neutral-600"
                                                onClick={() => handleRemove(variant)}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default PricingForm;
