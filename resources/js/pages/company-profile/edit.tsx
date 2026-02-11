import { SubmitButton } from '@/components/buttons/submit-button';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import companyProfile from '@/routes/company-profile';
import { BreadcrumbItem } from '@/types';
import { CompanyProfile } from '@/types/company-profile';
import { Form, Head } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface PageProps {
    profile: CompanyProfile;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company Profile',
        href: companyProfile.index(),
    },
    {
        title: 'Edit',
        href: '',
    },
];

const Edit = ({ profile }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Company Profile" />

            <Form
                {...companyProfile.update.form(profile)}
                resetOnSuccess={false}
                disableWhileProcessing
                className="container mx-auto flex flex-1 flex-col gap-8 p-4 md:p-8"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <PageHeader
                                title="Edit Company Profile"
                                description="Perbarui informasi perusahaan Anda di sini."
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
                                <SubmitButton processing={processing} className="rounded-full">
                                    <span className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </span>
                                </SubmitButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="space-y-8 lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Identitas Perusahaan</CardTitle>
                                        <CardDescription>
                                            Informasi dasar mengenai brand perusahaan.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Nama Perusahaan</Label>
                                                <Input
                                                    name="company_name"
                                                    defaultValue={profile.company_name}
                                                    placeholder="PT Contoh Maju Jaya"
                                                />
                                                <InputError message={errors.company_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tagline</Label>
                                                <Input
                                                    name="tagline"
                                                    defaultValue={profile.tagline ?? ''}
                                                    placeholder="Solusi terbaik untuk..."
                                                />
                                                <InputError message={errors.tagline} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Deskripsi</Label>
                                            <Textarea
                                                name="description"
                                                rows={5}
                                                defaultValue={profile.description ?? ''}
                                                placeholder="Jelaskan secara singkat tentang perusahaan Anda..."
                                                className="resize-none"
                                            />
                                            <InputError message={errors.description} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Lokasi & Alamat</CardTitle>
                                        <CardDescription>
                                            Dimana pelanggan dapat menemukan Anda.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="space-y-2">
                                            <Label>Alamat Lengkap</Label>
                                            <Textarea
                                                name="address"
                                                rows={3}
                                                defaultValue={profile.address}
                                                placeholder="Jl. Jendral Sudirman No..."
                                                className="resize-none"
                                            />
                                            <InputError message={errors.address} />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label>Kota / Kabupaten</Label>
                                                <Input name="city" defaultValue={profile.city} />
                                                <InputError message={errors.city} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Provinsi</Label>
                                                <Input
                                                    name="province"
                                                    defaultValue={profile.province}
                                                />
                                                <InputError message={errors.province} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Kode Pos</Label>
                                                <Input
                                                    name="postal_code"
                                                    defaultValue={profile.postal_code}
                                                />
                                                <InputError message={errors.postal_code} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Google Map URL (Embed Link)</Label>
                                            <Input
                                                name="google_map_url"
                                                defaultValue={profile.google_map_url}
                                                placeholder="https://maps.google.com/..."
                                            />
                                            <InputError message={errors.google_map_url} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="space-y-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Kontak</CardTitle>
                                        <CardDescription>
                                            Saluran komunikasi publik.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input
                                                name="email"
                                                type="email"
                                                defaultValue={profile.email}
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>No. Telepon</Label>
                                            <Input name="phone" defaultValue={profile.phone} />
                                            <InputError message={errors.phone} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>WhatsApp</Label>
                                            <Input
                                                name="whatsapp"
                                                defaultValue={profile.whatsapp}
                                            />
                                            <InputError message={errors.whatsapp} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Jam Operasional</Label>
                                            <Input
                                                name="working_hours"
                                                defaultValue={profile.working_hours}
                                                placeholder="Senin - Jumat, 08:00 - 17:00"
                                            />
                                            <InputError message={errors.working_hours} />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Media Sosial</CardTitle>
                                        <CardDescription>Link profil media sosial.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label>Instagram URL</Label>
                                            <Input
                                                name="instagram"
                                                defaultValue={profile.instagram ?? ''}
                                                placeholder="https://instagram.com/..."
                                            />
                                            <InputError message={errors.instagram} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>TikTok URL</Label>
                                            <Input
                                                name="tiktok"
                                                defaultValue={profile.tiktok ?? ''}
                                                placeholder="https://tiktok.com/@..."
                                            />
                                            <InputError message={errors.tiktok} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Facebook URL</Label>
                                            <Input
                                                name="facebook"
                                                defaultValue={profile.facebook ?? ''}
                                                placeholder="https://facebook.com/..."
                                            />
                                            <InputError message={errors.facebook} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AppLayout>
    );
};

export default Edit;
