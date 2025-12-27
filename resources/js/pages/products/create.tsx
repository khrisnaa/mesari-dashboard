import { ColorPickerDialog } from '@/components/color-picker';
import { GalleryUploader } from '@/components/product/form/gallery-uploader';
import { NewCategoryDialog } from '@/components/product/form/new-category';
import PricingForm from '@/components/product/form/pricing-form';
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
import { Textarea } from '@/components/ui/textarea';
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
import { ChevronLeftIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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

export const DISCOUNT_EVENT_TYPES = [
    { value: 'NEW_YEAR', label: 'New Year' },
    { value: 'CHRISTMAS', label: 'Christmas' },
    { value: 'BLACK_FRIDAY', label: 'Black Friday' },
    { value: 'CYBER_MONDAY', label: 'Cyber Monday' },
    { value: 'RAMADAN', label: 'Ramadan' },
    { value: 'EID', label: 'Eid al-Fitr' },
    { value: 'INDEPENDENCE_DAY', label: 'Independence Day' },
    { value: 'HALLOWEEN', label: 'Halloween' },
    { value: 'BACK_TO_SCHOOL', label: 'Back to School' },
    { value: 'FLASH_SALE', label: 'Flash Sale' },
    { value: 'CLEARANCE', label: 'Clearance Sale' },
    { value: 'BIRTHDAY', label: 'Birthday Sale' },
];

interface PageProps {
    categories: Category[];
    sizes: Attribute[];
    colors: Attribute[];
}

export interface ImageFile {
    tempId: string;
    file: File;
    type: 'thumbnail' | 'gallery';
    preview: string;
}

const Create = ({ categories, colors, sizes }: PageProps) => {
    const form = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: '',
            description: '',
            variants: [],
            images: [],
            category_id: '',
            base_price: 0,
            base_stock: 0,
        },
    });

    const onSubmit = (data: CreateProductInput) => {
        console.log(data);
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('variants', JSON.stringify(data.variants));
        formData.append('category_id', data.category_id);

        if (data.description) {
            formData.append('description', data.description);
        }

        imageFiles.forEach((img, index) => {
            formData.append(`images[${index}][type]`, img.type);
            formData.append(`images[${index}][file]`, img.file);
        });

        router.post(products.store(), formData, {
            forceFormData: true,
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0];
                toast.error(errorMessage);
            },
        });
    };

    // select sizes handler
    const [selectedSizes, setSelectedSizes] = useState<Attribute[] | []>([]);
    const toggleSize = (size: Attribute) => {
        setSelectedSizes((prev) => {
            const exists = prev.some((s) => s.id === size.id);
            const next = exists ? prev.filter((s) => s.id !== size.id) : [...prev, size];

            if (next.length > 0) {
                setSizeError(false);
            }

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

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [customColors, setCustomColors] = useState<Attribute[]>([]);
    const handleAddColor = (color: Attribute) => {
        setSelectedColors((prev) => [...prev, color]);
        setCustomColors((prev) => [...prev, color]);
    };

    // dialog handler
    const [showPricesDialog, setShowPricesDialog] = useState(false);
    const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);

    // validate size
    const [sizeError, setSizeError] = useState(false);

    const validateSize = () => {
        const isValid = selectedSizes.length > 0;

        setSizeError(!isValid);
        return isValid;
    };

    // images handler
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

    const handleThumbnailChange = (file: ImageFile) => {
        setImageFiles((prev) => [...prev.filter((i) => i.type !== 'thumbnail'), file]);

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

    const handleGalleryChange = (files: ImageFile[]) => {
        setImageFiles((prev) => {
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
        setImageFiles((prev) => prev.filter((img) => img.tempId !== tempId));

        const currentImages = form.getValues('images') || [];

        form.setValue('images', currentImages.slice(0, currentImages.length - 1), {
            shouldValidate: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                    <section className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.get(products.index(), { replace: true })}
                            >
                                <ChevronLeftIcon />
                            </Button>
                            <h3 className="text-xl font-semibold">Add New Product</h3>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    if (!validateSize()) return;
                                    form.handleSubmit(onSubmit)();
                                }}
                                type="button"
                                size="lg"
                                className="rounded-full"
                            >
                                <Plus />
                                Add Product
                            </Button>
                        </div>
                    </section>

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
                                        {sizeError && (
                                            <FormMessage>At least one size is required</FormMessage>
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
                                                    onClick={() => setShowColorPicker(true)}
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

                                    {/* <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="pricing">
                                                Discount
                                            </Label>
                                            <Input
                                                id="pricing"
                                                type="text"
                                                autoComplete="off"
                                                name="pricing"
                                                placeholder="50000"
                                            />
                                            <InputError
                                                message=""
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="stock">
                                                Discount Type
                                            </Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select discount type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DISCOUNT_EVENT_TYPES.map(
                                                        (discount, i) => (
                                                            <SelectItem
                                                                key={i}
                                                                value={
                                                                    discount.value
                                                                }
                                                            >
                                                                {discount.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message=""
                                                className="mt-2"
                                            />
                                        </div>
                                    </div> */}

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() =>
                                                selectedSizes.length == 0
                                                    ? setSizeError(true)
                                                    : setShowPricesDialog(true)
                                            }
                                            size="lg"
                                            className="w-fit rounded-full"
                                        >
                                            Add more prices
                                        </Button>
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
                                        onClick={() => !sizeError && setShowNewCategoryDialog(true)}
                                        type="button"
                                        size="lg"
                                        className="rounded-full"
                                    >
                                        Add category
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </section>
                </form>
                {/* Dialog Components */}
                <ColorPickerDialog
                    open={showColorPicker}
                    onOpenChange={setShowColorPicker}
                    onColorSelect={handleAddColor}
                />

                <PricingForm
                    open={showPricesDialog}
                    onOpenChange={setShowPricesDialog}
                    colors={selectedColors}
                    sizes={selectedSizes}
                />

                {/* <MultiplePricesDialog
                    open={showPricesDialog}
                    onOpenChange={setShowPricesDialog}
                    colors={selectedColors}
                    sizes={selectedSizes}
                    onSubmit={(data) => {
                        form.setValue('variants', data, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                        setShowPricesDialog(false);
                    }}
                    setBasePriceProp={setBasePrice}
                    setBaseStockProp={setBaseStock}
                    basePriceProp={basePrice}
                    baseStockProp={baseStock}
                /> */}

                <NewCategoryDialog
                    open={showNewCategoryDialog}
                    onOpenChange={setShowNewCategoryDialog}
                />
            </Form>
        </AppLayout>
    );
};
export default Create;
