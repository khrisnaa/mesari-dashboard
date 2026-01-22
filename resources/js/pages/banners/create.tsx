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
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: banners.index(),
    },
    {
        title: 'Create',
        href: '',
    },
];

const Create = () => {
    const [backdrop, setBackdrop] = useState<ImageValue | null>(null);
    const [image, setImage] = useState<ImageValue | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        backdrop: null as File | null,
        image: null as File | null,
        cta_text: '',
        cta_link: '',
        sort_order: 0,
        is_published: true,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/banners', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Banner" />

            <div className="flex h-full max-w-4xl flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Create Banner"
                    description="Add a new banner to highlight featured content."
                />
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
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
                                id="description"
                                name="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex gap-6 md:col-span-2">
                            <div className="flex-1 space-y-2">
                                <Label>Backdrop Image</Label>
                                <SingleImageUpload
                                    value={backdrop}
                                    onChange={(v) => {
                                        setBackdrop(v);
                                        setData('backdrop', v?.file ?? null);
                                    }}
                                    aspect="video"
                                />

                                <InputError message={errors.backdrop} />
                            </div>

                            <div className="flex-[0.565] space-y-2">
                                <Label>Main Image</Label>
                                <SingleImageUpload
                                    value={image}
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
                                id="cta_text"
                                name="cta_text"
                                type="text"
                                value={data.cta_text}
                                onChange={(e) => setData('cta_text', e.target.value)}
                            />
                            <InputError message={errors.cta_text} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cta_link">CTA Link</Label>
                            <Input
                                id="cta_link"
                                name="cta_link"
                                type="text"
                                value={data.cta_link}
                                onChange={(e) => setData('cta_link', e.target.value)}
                            />
                            <InputError message={errors.cta_link} />
                        </div>

                        <div className="flex items-center justify-between md:col-span-2">
                            <Label htmlFor="is_published">Published</Label>
                            <Switch
                                id="is_published"
                                checked={data.is_published}
                                onCheckedChange={(val) => setData('is_published', val)}
                            />
                        </div>
                        <InputError message={errors.is_published} />
                    </div>

                    <div className="mt3 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => history.back()}
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <SubmitButton processing={processing}>Create Banner</SubmitButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};
export default Create;
