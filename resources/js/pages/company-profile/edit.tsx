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
import { Form, Head, router } from '@inertiajs/react';
import { ArrowLeft, Save, Search } from 'lucide-react';
import { useState } from 'react';

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

interface LocationData {
    id: number;
    province_name: string;
    city_name: string;
    district_name: string;
    subdistrict_name: string;
    zip_code: string;
}

interface PageProps {
    profile: CompanyProfile;
    locations?: LocationData[];
}

const Edit = ({ profile, locations = [] }: PageProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const [locData, setLocData] = useState({
        origin_id: profile.origin_id || '',
        province_name: profile.province_name || '',
        city_name: profile.city_name || '',
        district_name: profile.district_name || '',
        subdistrict_name: profile.subdistrict_name || '',
        postal_code: profile.postal_code || '',
    });

    const handleSearchKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (!searchQuery.trim()) return;

            setIsSearching(true);
            router.reload({
                data: { search: searchQuery },
                only: ['locations'],
                // preserveState: true,
                // preserveScroll: true,
                onFinish: () => setIsSearching(false),
            });
        }
    };

    const handleSelectLocation = (loc: LocationData) => {
        setLocData({
            origin_id: loc.id,
            province_name: loc.province_name,
            city_name: loc.city_name,
            district_name: loc.district_name,
            subdistrict_name: loc.subdistrict_name,
            postal_code: loc.zip_code || '',
        });

        setSearchQuery('');
    };

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
                                description="Update your company information here."
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
                                        Save Changes
                                    </span>
                                </SubmitButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="space-y-8 lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Company Identity</CardTitle>
                                        <CardDescription>
                                            Basic information about your company brand.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Company Name</Label>
                                                <Input
                                                    name="company_name"
                                                    defaultValue={profile.company_name}
                                                    placeholder="Example: PT Maju Jaya"
                                                />
                                                <InputError message={errors.company_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Tagline</Label>
                                                <Input
                                                    name="tagline"
                                                    defaultValue={profile.tagline ?? ''}
                                                    placeholder="Your best solution for..."
                                                />
                                                <InputError message={errors.tagline} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                name="description"
                                                rows={5}
                                                defaultValue={profile.description ?? ''}
                                                placeholder="Describe your company briefly..."
                                                className="resize-none"
                                            />
                                            <InputError message={errors.description} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Location & Address</CardTitle>
                                        <CardDescription>
                                            Where customers can find you and your origin shipping
                                            point.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                                            <Label>Search Origin Location</Label>
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    placeholder="Type subdistrict or city name and press Enter..."
                                                    className="pl-9"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyDown={handleSearchKeyDown}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Press <strong>Enter</strong> to search location.
                                            </p>

                                            {isSearching && (
                                                <p className="text-sm text-blue-500">
                                                    Searching...
                                                </p>
                                            )}
                                            {locations.length > 0 && searchQuery && (
                                                <div className="mt-2 flex max-h-48 flex-col gap-1 overflow-y-auto rounded-md border bg-background p-1 shadow-sm">
                                                    {locations.map((loc) => (
                                                        <button
                                                            key={loc.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleSelectLocation(loc)
                                                            }
                                                            className="flex flex-col items-start rounded px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <span className="font-medium">
                                                                {loc.subdistrict_name},{' '}
                                                                {loc.district_name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {loc.city_name}, {loc.province_name}{' '}
                                                                - {loc.zip_code}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Full Address</Label>
                                            <Textarea
                                                name="address"
                                                rows={3}
                                                defaultValue={profile.address}
                                                placeholder="Jl. Jendral Sudirman No..."
                                                className="resize-none"
                                            />
                                            <InputError message={errors.address} />
                                        </div>

                                        <input
                                            type="hidden"
                                            name="origin_id"
                                            value={locData.origin_id}
                                        />
                                        <InputError message={errors.origin_id} />

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Province</Label>
                                                <Input
                                                    name="province_name"
                                                    value={locData.province_name}
                                                    readOnly
                                                    className="bg-muted"
                                                />
                                                <InputError message={errors.province_name} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>City / Regency</Label>
                                                <Input
                                                    name="city_name"
                                                    value={locData.city_name}
                                                    readOnly
                                                    className="bg-muted"
                                                />
                                                <InputError message={errors.city_name} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label>District</Label>
                                                <Input
                                                    name="district_name"
                                                    value={locData.district_name}
                                                    readOnly
                                                    className="bg-muted"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Subdistrict</Label>
                                                <Input
                                                    name="subdistrict_name"
                                                    value={locData.subdistrict_name}
                                                    readOnly
                                                    className="bg-muted"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Postal Code</Label>
                                                <Input
                                                    name="postal_code"
                                                    value={locData.postal_code}
                                                    onChange={(e) =>
                                                        setLocData({
                                                            ...locData,
                                                            postal_code: e.target.value,
                                                        })
                                                    }
                                                />
                                                <InputError message={errors.postal_code} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Google Maps URL (Embed Link)</Label>
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
                                        <CardTitle>Contact</CardTitle>
                                        <CardDescription>
                                            Public communication channels.
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
                                            <Label>Phone Number</Label>
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
                                            <Label>Working Hours</Label>
                                            <Input
                                                name="working_hours"
                                                defaultValue={profile.working_hours}
                                                placeholder="Monday - Friday, 08:00 - 17:00"
                                            />
                                            <InputError message={errors.working_hours} />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Social Media</CardTitle>
                                        <CardDescription>
                                            Links to your social media profiles.
                                        </CardDescription>
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
