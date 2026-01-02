import { ColorPickerDialog } from '@/components/color-picker';
import { GalleryUploader } from '@/components/product/form/gallery-uploader';
import { NewCategoryDialog } from '@/components/product/form/new-category';
import PricingForm, { Variant } from '@/components/product/form/pricing-form';
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

import { ThumbnailUploader } from '@/components/product/form/thumbnail-uploader';
import { UpdateProductInput, updateProductSchema } from '@/schemas/product/updateProductSchema';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { Attribute, Product } from '@/types/product';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { ChevronLeftIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ImageState } from './create';

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
    product: Product;
}

export interface SortOrder {
    id: string;
    sort_order: number;
}
const Create = ({ categories, colors, sizes, product }: PageProps) => {
    const formattedvariants: Variant[] = product.variants.map((v) => {
        const sizeAttr = v.attributes?.find((a) => a.type == 'size');
        const colorAttr = v.attributes?.find((a) => a.type == 'color');

        return {
            price: v.price,
            stock: v.stock,
            color: colorAttr
                ? { name: colorAttr.name, id: colorAttr.id, hex: colorAttr.hex ?? null }
                : undefined,
            size: sizeAttr
                ? { name: sizeAttr.name, id: sizeAttr.id, hex: sizeAttr.hex ?? null }
                : undefined,
        };
    });

    const form = useForm<UpdateProductInput>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            variants: formattedvariants,
            category_id: product.category.id,
            base_price: 0,
            base_stock: 0,
        },
    });

    const onSubmit = (data: UpdateProductInput) => {
        const formData = new FormData();

        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('variants', JSON.stringify(data.variants));
        formData.append('category_id', data.category_id);
        formData.append('description', data.description || '');

        formData.append(
            'image_state',
            JSON.stringify(
                images.map((img) => ({
                    id: img.id ?? null,
                    type: img.type,
                    sort_order: img.sort_order,
                })),
            ),
        );

        images
            .filter((img) => img.file)
            .forEach((img, i) => {
                formData.append(`images_upload[${i}]`, img.file!);
            });

        router.post(products.update(product), formData, {
            forceFormData: true,
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0];
                toast.error(errorMessage);
            },
        });
    };

    // select sizes handler
    const productSizes = product.variants
        .flatMap((v) => v.attributes?.filter((a) => a.type === 'size') || [])
        .filter((attr, index, self) => index === self.findIndex((a) => a.name === attr.name));

    const [selectedSizes, setSelectedSizes] = useState<Attribute[] | []>(productSizes);
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
    const productColors = product.variants
        .flatMap((v) => v.attributes?.filter((a) => a.type === 'color') || [])
        .filter((attr, index, self) => index === self.findIndex((a) => a.name === attr.name));

    const [selectedColors, setSelectedColors] = useState<Attribute[] | []>(productColors);
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
    const [images, setImages] = useState<ImageState[]>(() =>
        product.images.map((img) => ({
            id: img.id,
            tempId: img.id,
            type: img.type,
            preview: `/storage/${img.path}`,
            sort_order: img.sort_order,
        })),
    );

    const handleThumbnailChange = (file: ImageState) => {
        setImages((prev) => {
            const gallery = prev.filter((i) => i.type !== 'thumbnail');
            return [
                { ...file, sort_order: 0 },
                ...gallery.map((img, i) => ({ ...img, sort_order: i + 1 })),
            ];
        });
    };

    const handleGalleryChange = (files: ImageState[]) => {
        setImages((prev) => {
            const existingGallery = prev.filter((img) => img.type === 'gallery' && img.id);

            const thumbnail = prev.filter((img) => img.type === 'thumbnail');

            const start = existingGallery.length;

            const newGallery = files.map((f, i) => ({
                ...f,
                sort_order: start + i,
            }));

            return [...thumbnail, ...existingGallery, ...newGallery];
        });
    };

    const handleRemoveImage = (tempId: string) => {
        setImages((prev) =>
            prev
                .filter((img) => img.tempId !== tempId)
                .map((img, i) => ({
                    ...img,
                    sort_order: i,
                })),
        );
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

    const thumbnailImage = images.find((img) => img.type === 'thumbnail');
    const galleryImages = images
        .filter((img) => img.type === 'gallery')
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

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
                                            Edit prices
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
                                            existingImage={thumbnailImage}
                                        />
                                    </div>
                                    <GalleryUploader
                                        onChange={(files) => handleGalleryChange(files)}
                                        onRemove={handleRemoveImage}
                                        existingImages={galleryImages}
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

                <NewCategoryDialog
                    open={showNewCategoryDialog}
                    onOpenChange={setShowNewCategoryDialog}
                />
            </Form>
        </AppLayout>
    );
};
export default Create;
