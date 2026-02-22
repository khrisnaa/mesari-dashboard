import { SubmitButton } from '@/components/buttons/submit-button';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { ImageValue, SingleImageUpload } from '@/components/single-image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import banners from '@/routes/banners';
import { BreadcrumbItem } from '@/types';
import { Banner } from '@/types/banner';
import { Category } from '@/types/category';
import { BannerType } from '@/types/enum';
import { Product } from '@/types/product';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banners',
        href: banners.index(),
    },
    {
        title: 'Edit',
        href: '',
    },
];

interface PageProps {
    banner: Banner & { products?: Product[] }; // Memastikan ada relasi products
    categories: Category[];
    products: Product[];
}

const Edit = ({ banner, categories, products }: PageProps) => {
    const [backdrop, setBackdrop] = useState<ImageValue | null>(null);
    const [image, setImage] = useState<ImageValue | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: banner.title ?? '',
        description: banner.description ?? '',
        backdrop: null as File | null,
        image: null as File | null,
        cta_text: banner.cta_text ?? '',
        cta_link: banner.cta_link ?? '',
        cta_target_id: banner.cta_target_id ?? '',

        product_ids: banner.products?.map((p) => p.id) ?? ([] as string[]),
        sort_order: banner.sort_order ?? 0,
        is_published: banner.is_published ?? true,
        cta_type: banner.cta_type.toString() ?? '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(
            `/banners/${banner.id}`,
            {
                ...data,
                _method: 'put',
            },
            {
                forceFormData: true,
            },
        );
    };

    // Fungsi untuk mereset field terkait saat mengganti tipe CTA
    const handleCtaTypeChange = (value: string) => {
        setData((prevData) => ({
            ...prevData,
            cta_type: value,
            // Kembalikan ke nilai asli banner jika kembali ke tipe semula, jika tidak kosongkan
            cta_link: value === banner.cta_type ? (banner.cta_link ?? '') : '',
            cta_target_id: value === banner.cta_type ? (banner.cta_target_id ?? '') : '',
            product_ids: value === banner.cta_type ? (banner.products?.map((p) => p.id) ?? []) : [],
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Banner" />

            <form
                onSubmit={submit}
                className="container mx-auto flex flex-1 flex-col gap-8 p-4 md:p-8"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <PageHeader
                        title="Edit Banner"
                        description="Update banner information and display."
                    />

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing}
                            onClick={() => history.back()}
                            size="lg"
                            className="gap-2 rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Cancel
                        </Button>
                        <SubmitButton processing={processing}>
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" />
                                Update Banner
                            </span>
                        </SubmitButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-8 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Main title and description for this banner.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Special Summer Promo"
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Catchy short description..."
                                        className="resize-none"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Media Assets */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Media & Images</CardTitle>
                                <CardDescription>
                                    Upload images for the background and main content.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-6">
                                <div className="flex-1 space-y-2">
                                    <Label>Backdrop Image (Landscape)</Label>
                                    <div className="rounded-lg border border-dashed p-1">
                                        <SingleImageUpload
                                            value={backdrop}
                                            existingImage={
                                                banner.backdrop_path
                                                    ? {
                                                          preview: banner.backdrop_path,
                                                          tempId: 'existing-backdrop',
                                                      }
                                                    : null
                                            }
                                            onChange={(v) => {
                                                setBackdrop(v);
                                                setData('backdrop', v?.file ?? null);
                                            }}
                                            aspect="video"
                                        />
                                    </div>
                                    <InputError message={errors.backdrop} />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        16:9 ratio is recommended for background.
                                    </p>
                                </div>

                                <div className="flex-[0.565] space-y-2">
                                    <Label>Main Image (Square/Portrait)</Label>
                                    <div className="rounded-lg border border-dashed p-1">
                                        <SingleImageUpload
                                            value={image}
                                            existingImage={
                                                banner.image_path
                                                    ? {
                                                          preview: banner.image_path,
                                                          tempId: 'existing-image',
                                                      }
                                                    : null
                                            }
                                            onChange={(v) => {
                                                setImage(v);
                                                setData('image', v?.file ?? null);
                                            }}
                                            aspect="square"
                                        />
                                    </div>
                                    <InputError message={errors.image} />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Main product or object image.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-8">
                        {/* 4. Display Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Display Settings</CardTitle>
                                <CardDescription>Configure type and sorting order.</CardDescription>
                            </CardHeader>
                            <CardContent className="gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        min={0}
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData('sort_order', Number(e.target.value))
                                        }
                                    />
                                    <p className="text-[0.8rem] text-muted-foreground">
                                        Display order (lowest number first).
                                    </p>
                                    <InputError message={errors.sort_order} />
                                </div>

                                <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_published" className="text-base">
                                            Published
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display on website?
                                        </p>
                                    </div>
                                    <Switch
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(val) => setData('is_published', val)}
                                    />
                                </div>
                                <InputError message={errors.is_published} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Call to Action (CTA)</CardTitle>
                                <CardDescription>
                                    Action button that will appear on the banner.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Banner CTA Type</Label>
                                    <Select
                                        value={data.cta_type as BannerType}
                                        onValueChange={handleCtaTypeChange}
                                    >
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Select banner type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={BannerType.NONE}>None</SelectItem>
                                            <SelectItem value={BannerType.CATEGORY}>
                                                Category
                                            </SelectItem>
                                            <SelectItem value={BannerType.PRODUCT}>
                                                Product
                                            </SelectItem>
                                            <SelectItem value={BannerType.PRODUCTS}>
                                                Products
                                            </SelectItem>
                                            <SelectItem value={BannerType.EXTERNAL}>
                                                External
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.cta_type} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cta_text">CTA Text</Label>
                                    <Input
                                        id="cta_text"
                                        name="cta_text"
                                        value={data.cta_text}
                                        onChange={(e) => setData('cta_text', e.target.value)}
                                        placeholder="e.g. Shop Now"
                                    />
                                    <InputError message={errors.cta_text} />
                                </div>

                                {/* Dynamic Fields based on cta_type */}
                                {data.cta_type === BannerType.EXTERNAL && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_link">CTA Link</Label>
                                        <Input
                                            id="cta_link"
                                            name="cta_link"
                                            value={data.cta_link}
                                            onChange={(e) => setData('cta_link', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        <InputError message={errors.cta_link} />
                                    </div>
                                )}

                                {data.cta_type === BannerType.CATEGORY && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_target_category">Target Category</Label>
                                        <Select
                                            value={data.cta_target_id}
                                            onValueChange={(val) => setData('cta_target_id', val)}
                                        >
                                            <SelectTrigger id="cta_target_category">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories?.map((category: any) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name || category.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.cta_target_id} />
                                    </div>
                                )}

                                {data.cta_type === BannerType.PRODUCT && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_target_product">Target Product</Label>
                                        <Select
                                            value={data.cta_target_id}
                                            onValueChange={(val) => setData('cta_target_id', val)}
                                        >
                                            <SelectTrigger id="cta_target_product">
                                                <SelectValue placeholder="Select a product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products?.map((product: any) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name || product.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.cta_target_id} />
                                    </div>
                                )}

                                {data.cta_type === BannerType.PRODUCTS && (
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Select Products</Label>
                                        <div className="max-h-48 overflow-y-auto rounded-md border border-input bg-transparent p-2">
                                            {products?.length > 0 ? (
                                                products.map((product: any) => (
                                                    <label
                                                        key={product.id}
                                                        className="flex cursor-pointer items-center space-x-3 rounded-sm p-2 hover:bg-muted"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            value={product.id}
                                                            checked={data.product_ids.includes(
                                                                product.id,
                                                            )}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setData(
                                                                    'product_ids',
                                                                    checked
                                                                        ? [
                                                                              ...data.product_ids,
                                                                              product.id,
                                                                          ]
                                                                        : data.product_ids.filter(
                                                                              (id) =>
                                                                                  id !== product.id,
                                                                          ),
                                                                );
                                                            }}
                                                            className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-sm leading-none font-medium">
                                                            {product.name || product.title}
                                                        </span>
                                                    </label>
                                                ))
                                            ) : (
                                                <p className="p-2 text-sm text-muted-foreground">
                                                    No products available.
                                                </p>
                                            )}
                                        </div>
                                        <InputError message={errors.product_ids} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
};

export default Edit;
