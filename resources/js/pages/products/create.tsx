import { SubmitButton } from '@/components/buttons/submit-button';
import { ColorPickerDialog } from '@/components/color-picker';
import { DateTimePicker } from '@/components/date-time-picker';
import { PageHeader } from '@/components/page-header';
import { GalleryUploader } from '@/components/product/form/gallery-uploader';
import { NewCategoryDialog } from '@/components/product/form/new-category';
import PricingForm, { Variant } from '@/components/product/form/pricing-form';
import { ThumbnailUploader } from '@/components/product/form/thumbnail-uploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { VariantAttribute } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Plus, TruckIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

export const DISCOUNT_TYPES = [
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
    sizes: VariantAttribute[];
    colors: VariantAttribute[];
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
            is_customizable: false,
            custom_additional_price: 0,
            discount_type: '',
            discount_value: 0,
            discount_start_at: '',
            discount_end_at: '',
            weight: 0,
        },
    });

    // dialog handler
    const pricesDialog = useDialog();
    const categoryDialog = useDialog();
    const colorPickerDialog = useDialog();

    // select sizes handler
    const [selectedSizes, setSelectedSizes] = useState<VariantAttribute[] | []>([]);

    const toggleSize = (size: VariantAttribute) => {
        setSelectedSizes((prev) => {
            const exists = prev.some((s) => s.id === size.id);
            const next = exists ? prev.filter((s) => s.id !== size.id) : [...prev, size];

            const selectedNames = next.map((s) => s.name);

            form.setValue('selected_sizes', selectedNames, { shouldValidate: true });
            return next;
        });
    };

    // select colors handler
    const [selectedColors, setSelectedColors] = useState<VariantAttribute[] | []>([]);

    const toggleColor = (color: VariantAttribute) => {
        setSelectedColors((prev) => {
            const exists = prev.some((c) => c.hex === color.hex && c.name === color.name);

            if (exists) {
                return prev.filter((c) => c.hex !== color.hex || c.name !== color.name);
            }

            return [...prev, color];
        });
    };

    // custom colors
    const [customColors, setCustomColors] = useState<VariantAttribute[]>([]);

    const handleAddColor = (color: VariantAttribute) => {
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
    const startValue = form.watch('discount_start_at');
    const endValue = form.watch('discount_end_at');
    const discountType = form.watch('discount_type');

    // handle variant pricing
    const [isDifferentPricing, setIsDifferentPricing] = useState(false);

    // form submit handler
    const [loading, setLoading] = useState(false);
    const onSubmit = (data: CreateProductInput) => {
        setLoading(true);
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('variants', JSON.stringify(data.variants));
        formData.append('category_id', data.category_id);
        formData.append('description', data.description || '');
        formData.append('is_published', data.is_published ? '1' : '0');
        formData.append('is_customizable', data.is_customizable ? '1' : '0');
        formData.append('discount_type', data.discount_type || '');
        formData.append('discount_value', data.discount_value ? String(data.discount_value) : '');
        formData.append('discount_start_at', data.discount_start_at || '');
        formData.append('discount_end_at', data.discount_end_at || '');
        formData.append(
            'custom_additional_price',
            data.custom_additional_price ? String(data.custom_additional_price) : '',
        );
        formData.append('weight', data.weight ? String(data.weight) : '');

        images.forEach((img, index) => {
            formData.append(`images[${index}][type]`, img.type);
            if (img.file) {
                formData.append(`images[${index}][file]`, img.file);
            }
        });

        router.post(products.store(), formData, {
            forceFormData: true,
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0];
                toast.error(errorMessage);
            },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="container mx-auto space-y-6 p-4"
                >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <PageHeader
                            title="Create Product"
                            description="Add a new product to your catalogue."
                        />

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                onClick={() => history.back()}
                                size="lg"
                                className="gap-2 rounded-full"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Cancel
                            </Button>

                            <SubmitButton
                                processing={loading}
                                onClick={() => {
                                    form.handleSubmit(onSubmit)();
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Product
                                </span>
                            </SubmitButton>
                        </div>
                    </div>

                    <section className="flex gap-6">
                        {/* Left section */}
                        <section className="w-full space-y-6">
                            <Card className="space-y-4 p-4">
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

                                <div className="mt-16 grid grid-cols-2 items-start gap-8">
                                    <div className="col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Weight</FormLabel>
                                                    <FormControl>
                                                        <div className="group relative">
                                                            <Input
                                                                placeholder="0"
                                                                inputMode="numeric"
                                                                value={
                                                                    field.value
                                                                        ? formatNumber(
                                                                              field.value.toString(),
                                                                          )
                                                                        : ''
                                                                }
                                                                onChange={(e) => {
                                                                    const numericValue =
                                                                        parseNumber(e.target.value);
                                                                    field.onChange(numericValue);
                                                                }}
                                                            />
                                                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-muted-foreground group-focus-within:text-primary">
                                                                grams
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Set the base weight used for shipping
                                                        calculations.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <div className="flex flex-col gap-3 border-l border-border pt-1 pl-6">
                                            <div className="flex items-center gap-2 text-primary">
                                                <TruckIcon className="h-4 w-4" />
                                                <h4 className="text-sm font-bold tracking-wider uppercase">
                                                    Shipping Calculation
                                                </h4>
                                            </div>

                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                Most logistics partners (JNE, J&T) use a{' '}
                                                <span className="font-semibold text-foreground">
                                                    1,300g threshold
                                                </span>{' '}
                                                for the first kilo. Anything above 1,301g will be
                                                automatically charged as 2kg.
                                            </p>

                                            <div className="mt-1 w-fit rounded bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground uppercase">
                                                Pro Tip: Consider packaging weight (+/- 50-100g)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="space-y-4 p-4">
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
                                            name="discount_value"
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
                                                                                    'discount_value',
                                                                                    {
                                                                                        type: 'manual',
                                                                                        message:
                                                                                            'Percentage cannot exceed 100',
                                                                                    },
                                                                                );
                                                                                numeric = 100;
                                                                            } else {
                                                                                form.clearErrors(
                                                                                    'discount_value',
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
                                            name="discount_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Discount Type</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                const current =
                                                                    form.getValues(
                                                                        'discount_value',
                                                                    ) ?? 0;

                                                                if (
                                                                    value === 'percentage' &&
                                                                    current > 100
                                                                ) {
                                                                    form.setValue(
                                                                        'discount_value',
                                                                        100,
                                                                        {
                                                                            shouldValidate: true,
                                                                            shouldDirty: true,
                                                                        },
                                                                    );
                                                                }

                                                                form.clearErrors('discount_value');
                                                                field.onChange(value);
                                                            }}
                                                            defaultValue={field.value ?? undefined}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select discount type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {DISCOUNT_TYPES.map(
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
                                            name="discount_start_at"
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
                                            name="discount_end_at"
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
                            </Card>

                            <Card className="space-y-4 p-4">
                                <h4 className="font-semibold">Customization Settings</h4>

                                {/* Toggle is_customizable */}
                                <FormField
                                    control={form.control}
                                    name="is_customizable"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <div className="space-y-1">
                                                <FormLabel>Enable Customization</FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Allow customers to customize this product.
                                                </p>
                                            </div>

                                            <FormControl>
                                                <div className="flex items-center justify-between px-3 py-2">
                                                    <span className="text-sm font-medium">
                                                        {field.value
                                                            ? 'Customizable'
                                                            : 'Not Customizable'}
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

                                {/* Additional price only if customizable */}
                                {form.watch('is_customizable') && (
                                    <div className="pt-2">
                                        <FormField
                                            control={form.control}
                                            name="custom_additional_price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Additional Customization Price
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="0"
                                                            inputMode="numeric"
                                                            {...field}
                                                            value={formatNumber(field.value)}
                                                            onChange={(e) => {
                                                                const numericValue = parseNumber(
                                                                    e.target.value,
                                                                );
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
                            </Card>
                        </section>

                        {/* Right Section */}
                        <section className="w-full max-w-sm space-y-6">
                            <Card className="space-y-4 p-4">
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
                            </Card>

                            <Card className="space-y-4 p-4">
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
                            </Card>

                            <Card className="space-y-4 p-4">
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
                                                <div className="flex items-center justify-between px-3 py-2">
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
                            </Card>
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
                    setSelectedColors={setSelectedColors}
                    setSelectedSizes={setSelectedSizes}
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
                    className="flex items-center justify-between bg-muted/30 px-3 py-2"
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
