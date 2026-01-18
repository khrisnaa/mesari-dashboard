import { SubmitButton } from '@/components/buttons/submit-button';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { ImageValue, SingleImageUpload } from '@/components/single-image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import banners from '@/routes/banners';
import { Banner } from '@/types/banner';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface PageProps {
    banner: Banner;
}

const Edit = ({ banner }: PageProps) => {
    const [backdrop, setBackdrop] = useState<ImageValue | null>(null);
    const [image, setImage] = useState<ImageValue | null>(null);

    console.log(banner);

    const { data, setData, post, processing, errors } = useForm({
        title: banner.title ?? '',
        description: banner.description ?? '',
        backdrop: null as File | null,
        image: null as File | null,
        cta_text: banner.cta_text ?? '',
        cta_link: banner.cta_link ?? '',
        sort_order: banner.sort_order ?? 0,
        is_active: banner.is_active ?? true,
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
        <AppLayout
            breadcrumbs={[
                { title: 'Banners', href: banners.index() },
                { title: 'Edit', href: '' },
            ]}
        >
            <Head title="Edit Banner" />

            <div className="flex h-full max-w-4xl flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader title="Edit Banner" description="Update banner information." />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value))}
                            />
                            <InputError message={errors.sort_order} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex gap-6 md:col-span-2">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="backdrop">Backdrop Image</Label>
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
                                <InputError message={errors.backdrop} />
                            </div>

                            <div className="flex-[0.565] space-y-2">
                                <Label htmlFor="image">Main Image</Label>
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
                                <InputError message={errors.image} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cta_text">CTA Text</Label>
                            <Input
                                value={data.cta_text}
                                onChange={(e) => setData('cta_text', e.target.value)}
                            />
                            <InputError message={errors.cta_text} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cta_link">CTA Link</Label>
                            <Input
                                value={data.cta_link}
                                onChange={(e) => setData('cta_link', e.target.value)}
                            />
                            <InputError message={errors.cta_link} />
                        </div>

                        <div className="flex items-center justify-between md:col-span-2">
                            <Label htmlFor="is_active">Active</Label>
                            <Switch
                                checked={data.is_active}
                                onCheckedChange={(val) => setData('is_active', val)}
                            />
                        </div>
                        <InputError message={errors.is_active} />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>

                        <SubmitButton processing={processing}>Update Banner</SubmitButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default Edit;
