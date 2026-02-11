import { SubmitButton } from '@/components/buttons/submit-button';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import companyProfile from '@/routes/company-profile';
import { BreadcrumbItem } from '@/types';
import { CompanyProfile } from '@/types/company-profile';
import { Form, Head } from '@inertiajs/react';

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

            <div className="flex h-full max-w-4xl flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Edit Company Profile"
                    description="Update your company information."
                />

                <Form
                    {...companyProfile.update.form(profile)}
                    resetOnSuccess={[
                        'company_name',
                        'tagline',
                        'description',
                        'email',
                        'phone',
                        'whatsapp',
                        'address',
                        'city',
                        'province',
                        'postal_code',
                        'google_map_url',
                        'working_hours',
                        'instagram',
                        'tiktok',
                        'facebook',
                    ]}
                    disableWhileProcessing
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input
                                        name="company_name"
                                        defaultValue={profile.company_name}
                                    />
                                    <InputError message={errors.company_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Tagline</Label>
                                    <Input name="tagline" defaultValue={profile.tagline ?? ''} />
                                    <InputError message={errors.tagline} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        name="description"
                                        rows={3}
                                        defaultValue={profile.description ?? ''}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input name="email" defaultValue={profile.email} />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input name="phone" defaultValue={profile.phone} />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label>WhatsApp</Label>
                                    <Input name="whatsapp" defaultValue={profile.whatsapp} />
                                    <InputError message={errors.whatsapp} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Working Hours</Label>
                                    <Input
                                        name="working_hours"
                                        defaultValue={profile.working_hours}
                                    />
                                    <InputError message={errors.working_hours} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Address</Label>
                                    <Textarea
                                        name="address"
                                        rows={2}
                                        defaultValue={profile.address}
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input name="city" defaultValue={profile.city} />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Province</Label>
                                    <Input name="province" defaultValue={profile.province} />
                                    <InputError message={errors.province} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Postal Code</Label>
                                    <Input name="postal_code" defaultValue={profile.postal_code} />
                                    <InputError message={errors.postal_code} />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label>Google Map URL</Label>
                                    <Input
                                        name="google_map_url"
                                        defaultValue={profile.google_map_url}
                                    />
                                    <InputError message={errors.google_map_url} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Instagram</Label>
                                    <Input
                                        name="instagram"
                                        defaultValue={profile.instagram ?? ''}
                                    />
                                    <InputError message={errors.instagram} />
                                </div>

                                <div className="space-y-2">
                                    <Label>TikTok</Label>
                                    <Input name="tiktok" defaultValue={profile.tiktok ?? ''} />
                                    <InputError message={errors.tiktok} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Facebook</Label>
                                    <Input name="facebook" defaultValue={profile.facebook ?? ''} />
                                    <InputError message={errors.facebook} />
                                </div>
                            </div>

                            {/* ACTION */}
                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing}
                                    onClick={() => history.back()}
                                >
                                    Cancel
                                </Button>

                                <SubmitButton processing={processing}>Update Profile</SubmitButton>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
};

export default Edit;
