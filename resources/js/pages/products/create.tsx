import { ColorPickerDialog } from '@/components/color-picker';
import { DateTimePicker } from '@/components/date-time-picker';
import { PageHeader } from '@/components/page-header';
import { GalleryUploader } from '@/components/product/form/gallery-uploader';
import { NewCategoryDialog } from '@/components/product/form/new-category';
import PricingForm, { Variant } from '@/components/product/form/pricing-form';
import { ThumbnailUploader } from '@/components/product/form/thumbnail-uploader';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import products from '@/routes/products';
import { CreateProductInput, createProductSchema } from '@/schemas/product/createProductSchema';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { Attribute } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

export const DISCOUNT_EVENT_TYPES = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed' },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: products.index(),
    },
    {
        title: 'Create',
        href: '',
    },
];

interface PageProps {
    categories: Category[];
    sizes: Attribute[];
    colors: Attribute[];
}

export interface ImageState {
    id?: string;
    tempId: string;
    file?: File;
    type: 'thumbnail' | 'gallery';
    preview: string;
    sort_order?: number;
}

const Create = ({ colors, sizes, categories }: PageProps) => {
    // react hook form handler
    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            description: '',
            variants: [],
            images: [],
            is_published: false,
            category_id: '',
            base_price: 0,
            base_stock: 0,
            selected_sizes: [],
            discount: {
                type: '',
                value: 0,
                start_at: '',
                end_at: '',
            },
        },
    });

    // dialog handler
    const pricesDialog = useDialog();
    const categoryDialog = useDialog();
    const colorPickerDialog = useDialog();

    // select sizes handler
    const [selectedSizes, setSelectedSizes] = useState<Attribute[] | []>([]);

    const toggleSize = (size: Attribute) => {
        setSelectedSizes((prev) => {
            const exists = prev.some((s) => s.id === size.id);
            const next = exists ? prev.filter((s) => s.id !== size.id) : [...prev, size];

            const selectedNames = next.map((s) => s.name);

            form.setValue('selected_sizes', selectedNames, { shouldValidate: true });
            return next;
        });
    };

    // select colors handler
    const [selectedColors, setSelectedColors] = useState<Attribute[] | []>([]);

    const toggleColor = (color: Attribute) => {
        setSelectedColors((prev) => {
            const exists = prev.some((c) => c.hex === color.hex && c.name === color.name);

            if (exists) {
                return prev.filter((c) => c.hex !== color.hex || c.name !== color.name);
            }

            return [...prev, color];
        });
    };

    // custom colors
    const [customColors, setCustomColors] = useState<Attribute[]>([]);

    const handleAddColor = (color: Attribute) => {
        setSelectedColors((prev) => [...prev, color]);
        setCustomColors((prev) => [...prev, color]);
    };

    // images handler
    const [images, setImages] = useState<ImageState[]>([]);

    const handleThumbnailChange = (file: ImageState) => {
        setImages((prev) => [...prev.filter((i) => i.type !== 'thumbnail'), file]);

        form.setValue(
            'images',
            [
                ...(form.getValues('images') ?? []).filter((i) => i.type != 'thumbnail'),
                {
                    type: 'thumbnail' as const,
                },
            ],
            { shouldValidate: true, shouldDirty: true, shouldTouch: true },
        );
    };

    const handleGalleryChange = (files: ImageState[]) => {
        setImages((prev) => {
            const remaining = prev.filter((p) => !files.includes(p));
            return [...remaining, ...files];
        });

        form.setValue(
            'images',
            [
                ...(form.getValues('images') || []),
                ...files.map(() => ({
                    type: 'gallery' as const,
                })),
            ],
            { shouldValidate: true, shouldDirty: true, shouldTouch: true },
        );
    };

    const handleRemoveImage = (tempId: string) => {
        setImages((prev) => prev.filter((img) => img.tempId !== tempId));

        const currentImages = form.getValues('images') || [];

        form.setValue('images', currentImages.slice(0, currentImages.length - 1), {
            shouldValidate: true,
        });
    };

    const handleSortOrder = (items: ImageState[]) => {
        setImages((prev) => {
            const thumbnail = prev.filter((img) => img.type === 'thumbnail');

            const gallery = items.map((img, i) => ({
                ...img,
                sort_order: i,
            }));

            return [...thumbnail, ...gallery];
        });
    };

    // handle discount type, start and end date
    const startValue = form.watch('discount.start_at');
    const endValue = form.watch('discount.end_at');
    const discountType = form.watch('discount.type');

    // handle variant pricing
    const [isDifferentPricing, setIsDifferentPricing] = useState(false);

    // form submit handler
    const onSubmit = (data: CreateProductInput) => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('variants', JSON.stringify(data.variants));
        formData.append('category_id', data.category_id);
        formData.append('description', data.description || '');
        formData.append('is_published', data.is_published ? '1' : '0');

        images.forEach((img, index) => {
            formData.append(`images[${index}][type]`, img.type);
            if (img.file) {
                formData.append(`images[${index}][file]`, img.file);
            }
        });

        Object.entries(data.discount ?? {}).forEach(([key, val]) => {
            if (key === 'is_active') {
                formData.append(`discount[${key}]`, val ? '1' : '0');
            } else {
                formData.append(`discount[${key}]`, val != null ? String(val) : '');
            }
        });

        router.post(products.store(), formData, {
            forceFormData: true,
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0];
                toast.error(errorMessage);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                    <PageHeader
                        title="Create Product"
                        description="Add a new product to your catalogue."
                        actions={
                            <Button
                                onClick={() => {
                                    form.handleSubmit(onSubmit)();
                                }}
                                type="button"
                                size="lg"
                                className="rounded-full"
                            >
                                <Plus />
                                Save Product
                            </Button>
                        }
                    />

                    <section className="flex gap-6">
                        {/* Left section */}
                        <section className="w-full space-y-6">
                            <div className="space-y-4 rounded-lg border p-4">
                                <h4 className="font-semibold">General Information</h4>
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="White T-shirt" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        className="min-h-32"
                                                        placeholder="About product..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 items-start gap-6">
                                    <FormItem>
                                        <FormLabel>Size</FormLabel>
                                        <FormDescription>Pick Available Size</FormDescription>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                {sizes.map((size, i) => {
                                                    const selected = selectedSizes.some(
                                                        (s) => s.id === size.id,
                                                    );

                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant="outline"
                                                            size="icon"
                                                            className={cn(
                                                                selected &&
                                                                    'bg-primary text-secondary hover:bg-primary/90 hover:text-secondary',
                                                            )}
                                                            onClick={() => toggleSize(size)}
                                                        >
                                                            {size.name}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </FormControl>
                                        {form.formState.errors.selected_sizes && (
                                            <FormMessage>
                                                {form.formState.errors.selected_sizes.message}
                                            </FormMessage>
                                        )}
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormDescription>Pick Color Variant</FormDescription>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                {[...colors, ...customColors].map((color, i) => {
                                                    const selected = selectedColors.some(
                                                        (c) =>
                                                            c.hex == color.hex &&
                                                            c.name == color.name,
                                                    );

                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant="ghost"
                                                            size="icon"
                                                            className={cn(
                                                                'group relative inset-0 overflow-hidden rounded-full border hover:border-2 hover:border-neutral-300',
                                                                selected &&
                                                                    'border-2 border-primary hover:border-primary',
                                                            )}
                                                            onClick={() => toggleColor(color)}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    'h-full w-full rounded-full transition-transform duration-200 group-hover:scale-[85%]',
                                                                    selected && 'scale-[85%]',
                                                                )}
                                                                style={{
                                                                    backgroundColor:
                                                                        color.hex ?? '#fff',
                                                                }}
                                                            ></div>
                                                        </Button>
                                                    );
                                                })}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-full border-2"
                                                    onClick={() => colorPickerDialog.open()}
                                                >
                                                    <Plus />
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border p-4">
                                <h4 className="font-semibold">Pricing and Stock</h4>
                                <div className="grid gap-4">
                                    {isDifferentPricing ? (
                                        <VariantSummaryList />
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
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
                                                                value={formatNumber(field.value)}
                                                                onChange={(e) => {
                                                                    const numericValue =
                                                                        parseNumber(e.target.value);
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
                                                                value={formatNumber(field.value)}
                                                                onChange={(e) => {
                                                                    const numericValue =
                                                                        parseNumber(e.target.value);
                                                                    field.onChange(numericValue);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => {
                                                if (selectedSizes.length === 0) {
                                                    form.setError('selected_sizes', {
                                                        type: 'manual',
                                                        message: 'Select at least one size',
                                                    });
                                                    return;
                                                }
                                                form.clearErrors('selected_sizes');
                                                form.setValue('base_price', undefined, {
                                                    shouldDirty: true,
                                                });
                                                form.setValue('base_stock', undefined, {
                                                    shouldDirty: true,
                                                });
                                                pricesDialog.open();
                                            }}
                                            size="lg"
                                            className="w-fit rounded-full"
                                        >
                                            Add more prices
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="discount.value"
                                            render={({ field }) => {
                                                const isPercentage = discountType === 'percentage';

                                                return (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Discount {isPercentage ? '(%)' : ''}
                                                        </FormLabel>

                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    placeholder={
                                                                        isPercentage
                                                                            ? '0 - 100'
                                                                            : '0'
                                                                    }
                                                                    inputMode="numeric"
                                                                    {...field}
                                                                    value={
                                                                        isPercentage
                                                                            ? (field.value ?? '')
                                                                            : formatNumber(
                                                                                  field.value,
                                                                              )
                                                                    }
                                                                    onChange={(e) => {
                                                                        let raw = e.target.value;

                                                                        if (isPercentage) {
                                                                            let numeric = Number(
                                                                                raw.replace(
                                                                                    /[^0-9]/g,
                                                                                    '',
                                                                                ),
                                                                            );

                                                                            if (numeric > 100) {
                                                                                form.setError(
                                                                                    'discount.value',
                                                                                    {
                                                                                        type: 'manual',
                                                                                        message:
                                                                                            'Percentage cannot exceed 100',
                                                                                    },
                                                                                );
                                                                                numeric = 100;
                                                                            } else {
                                                                                form.clearErrors(
                                                                                    'discount.value',
                                                                                );
                                                                            }

                                                                            field.onChange(
                                                                                Number.isNaN(
                                                                                    numeric,
                                                                                )
                                                                                    ? null
                                                                                    : numeric,
                                                                            );
                                                                            return;
                                                                        }

                                                                        const numericValue =
                                                                            parseNumber(raw);
                                                                        field.onChange(
                                                                            numericValue,
                                                                        );
                                                                    }}
                                                                    className={
                                                                        isPercentage ? 'pr-10' : ''
                                                                    }
                                                                />

                                                                {isPercentage && (
                                                                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-500">
                                                                        %
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                );
                                            }}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="discount.type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount Type</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                const current =
                                                                    form.getValues(
                                                                        'discount.value',
                                                                    ) ?? 0;

                                                                if (
                                                                    value === 'percentage' &&
                                                                    current > 100
                                                                ) {
                                                                    form.setValue(
                                                                        'discount.value',
                                                                        100,
                                                                        {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                        },
                                                                    );
                                                                }

                                                                form.clearErrors('discount.value');
                                                                field.onChange(value);
                                                            }}
                                                            defaultValue={field.value ?? undefined}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select discount type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {DISCOUNT_EVENT_TYPES.map(
                                                                    (discount, i) => (
                                                                        <SelectItem
                                                                            key={i}
                                                                            value={discount.value}
                                                                        >
                                                                            {discount.label}
                                                                        </SelectItem>
                                                                    ),
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="discount.start_at"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Start Date</FormLabel>
                                                    <FormControl>
                                                        <DateTimePicker
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            maxDate={
                                                                endValue ? new Date(endValue) : null
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="discount.end_at"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>End Date</FormLabel>
                                                    <FormControl>
                                                        <DateTimePicker
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            minDate={
                                                                startValue
                                                                    ? new Date(startValue)
                                                                    : null
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Right Section */}
                        <section className="w-full max-w-sm space-y-6">
                            <div className="space-y-4 rounded-lg border p-4">
                                <h4 className="font-semibold">Product Images</h4>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-center bg-gray-100">
                                        <ThumbnailUploader
                                            onChange={(file) => handleThumbnailChange(file)}
                                            onRemove={handleRemoveImage}
                                        />
                                    </div>
                                    <GalleryUploader
                                        onChange={(files) => handleGalleryChange(files)}
                                        onRemove={handleRemoveImage}
                                        onSortOrder={handleSortOrder}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border p-4">
                                <h4 className="font-semibold">Category</h4>
                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Category</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select product category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category, i) => (
                                                            <SelectItem key={i} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => categoryDialog.open()}
                                        type="button"
                                        size="lg"
                                        className="rounded-full"
                                    >
                                        Add category
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 rounded-lg border p-4">
                                <h4 className="font-semibold">Publish Settings</h4>

                                <FormField
                                    control={form.control}
                                    name="is_published"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <div className="space-y-1">
                                                <FormLabel>Publish Product</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Toggle to publish or archived this product.
                                                </p>
                                            </div>

                                            <FormControl>
                                                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                                                    <span className="text-sm font-medium">
                                                        {field.value ? 'Published' : 'Archived'}
                                                    </span>

                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>
                    </section>
                </form>
                {/* dialog components */}
                <ColorPickerDialog
                    open={colorPickerDialog.isOpen}
                    onOpenChange={colorPickerDialog.onOpenChange}
                    onColorSelect={handleAddColor}
                />

                <PricingForm
                    open={pricesDialog.isOpen}
                    onOpenChange={pricesDialog.onOpenChange}
                    colors={selectedColors}
                    sizes={selectedSizes}
                    differentPricing={isDifferentPricing}
                    onDifferentPricing={setIsDifferentPricing}
                />

                <NewCategoryDialog
                    open={categoryDialog.isOpen}
                    onOpenChange={categoryDialog.onOpenChange}
                />
            </Form>
        </AppLayout>
    );
};

export default Create;

const VariantSummaryList = () => {
    const form = useFormContext();
    const variants: Variant[] = form.watch('variants') ?? [];

    const visible = variants.slice(0, 3);
    const hiddenCount = variants.length > 3 ? variants.length - 3 : 0;

    return (
        <div className="space-y-2">
            {visible.map((variant, i) => (
                <div
                    key={`${variant.size?.id}-${variant.color?.id}`}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                >
                    <div className="flex items-center gap-2">
                        {variant.color && (
                            <div
                                className="h-4 w-4 rounded-full border"
                                style={{
                                    backgroundColor: variant.color.hex ?? '#fff',
                                }}
                            />
                        )}

                        <span className="text-sm font-medium">
                            {variant.size?.name}
                            {variant.color ? ` / ${variant.color.name}` : ''}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-neutral-700">
                        <span>Rp {formatNumber(variant.price)}</span>
                        <span className="text-neutral-400">•</span>
                        <span>{formatNumber(variant.stock)} pcs</span>
                    </div>
                </div>
            ))}

            {hiddenCount > 0 && (
                <div className="ml-1 text-sm text-neutral-500">+{hiddenCount} more</div>
            )}
        </div>
    );
};
