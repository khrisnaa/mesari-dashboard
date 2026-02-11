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
import { BannerType } from '@/types/enum';
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
    banner: Banner;
}

const Edit = ({ banner }: PageProps) => {
    const [backdrop, setBackdrop] = useState<ImageValue | null>(null);
    const [image, setImage] = useState<ImageValue | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: banner.title ?? '',
        description: banner.description ?? '',
        backdrop: null as File | null,
        image: null as File | null,
        cta_text: banner.cta_text ?? '',
        cta_link: banner.cta_link ?? '',
        sort_order: banner.sort_order ?? 0,
        is_published: banner.is_published ?? true,
        type: banner.type,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Banner" />

            <form
                onSubmit={submit}
                className="container mx-auto flex max-w-7xl flex-1 flex-col gap-8 p-4 md:p-8"
            >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <PageHeader
                        title="Edit Banner"
                        description="Perbarui informasi dan tampilan banner."
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
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Judul dan deskripsi utama untuk banner ini.
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
                                        placeholder="Contoh: Promo Spesial Ramadhan"
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
                                        placeholder="Deskripsi singkat yang menarik..."
                                        className="resize-none"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Media Assets */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Media & Gambar</CardTitle>
                                <CardDescription>
                                    Upload gambar untuk background dan konten utama.
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
                                        Disarankan rasio 16:9 untuk background.
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
                                        Gambar produk atau objek utama.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Call to Action (CTA)</CardTitle>
                                <CardDescription>
                                    Tombol aksi yang akan muncul di banner.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="cta_text">CTA Text</Label>
                                    <Input
                                        id="cta_text"
                                        name="cta_text"
                                        value={data.cta_text}
                                        onChange={(e) => setData('cta_text', e.target.value)}
                                        placeholder="e.g. Belanja Sekarang"
                                    />
                                    <InputError message={errors.cta_text} />
                                </div>

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
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-8">
                        {/* 4. Display Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pengaturan Tampilan</CardTitle>
                                <CardDescription>Konfigurasi jenis dan urutan.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Banner Type</Label>
                                    <Select
                                        value={data.type as BannerType}
                                        onValueChange={(value) =>
                                            setData('type', value as BannerType)
                                        }
                                    >
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Select banner type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={BannerType.MARQUEE}>
                                                Marquee
                                            </SelectItem>
                                            <SelectItem value={BannerType.POPUP}>Popup</SelectItem>
                                            <SelectItem value={BannerType.BANNER}>
                                                Banner
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

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
                                        Urutan tampil (angka terkecil duluan).
                                    </p>
                                    <InputError message={errors.sort_order} />
                                </div>

                                <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="is_published" className="text-base">
                                            Published
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Tampilkan di website?
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
                    </div>
                </div>
            </form>
        </AppLayout>
    );
};

export default Edit;
