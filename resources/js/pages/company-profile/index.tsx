import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import companyProfile from '@/routes/company-profile';
import { BreadcrumbItem } from '@/types';
import { CompanyProfile } from '@/types/company-profile';
import { Head, Link } from '@inertiajs/react';

interface PageProps {
    profile: CompanyProfile;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Company Profile',
        href: '',
    },
];

const Index = ({ profile }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Profile" />

            <div className="flex h-full max-w-4xl flex-1 flex-col gap-6 rounded-xl p-4">
                <PageHeader title="Company Profile" description="Detail informasi perusahaan." />

                {/* MAIN CARD */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{profile.company_name}</CardTitle>
                        {profile.tagline && (
                            <p className="text-sm text-muted-foreground">{profile.tagline}</p>
                        )}
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-6 pt-6">
                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-muted-foreground">
                                Description
                            </p>
                            <p className="whitespace-pre-line">{profile.description ?? '-'}</p>
                        </div>

                        <Separator />

                        {/* CONTACT */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Info label="Email" value={profile.email} />
                            <Info label="Phone" value={profile.phone} />
                            <Info label="WhatsApp" value={profile.whatsapp} />
                            <Info label="Working Hours" value={profile.working_hours} />
                        </div>

                        <Separator />

                        {/* ADDRESS */}
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-muted-foreground">Address</p>
                            <p>
                                {profile.address}, {profile.city}, {profile.province}{' '}
                                {profile.postal_code}
                            </p>

                            <Link
                                href={profile.google_map_url}
                                target="_blank"
                                className="text-sm text-primary hover:underline"
                            >
                                View on Google Maps
                            </Link>
                        </div>

                        <Separator />

                        {/* SOCIAL MEDIA */}
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-muted-foreground">
                                Social Media
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <SocialBadge label="Instagram" value={profile.instagram} />
                                <SocialBadge label="TikTok" value={profile.tiktok} />
                                <SocialBadge label="Facebook" value={profile.facebook} />
                                <SocialBadge label="Shopee" value={profile.shopee} />
                                <SocialBadge label="Tokopedia" value={profile.tokopedia} />
                            </div>
                        </div>

                        {/* ACTION */}
                        <div className="flex justify-end">
                            <Link
                                href={companyProfile.edit()}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                            >
                                Edit Profile
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Index;

const Info = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p>{value || '-'}</p>
    </div>
);

const SocialBadge = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return <Badge variant="secondary">{label}</Badge>;

    return (
        <Badge asChild>
            <a href={value} target="_blank" className="hover:underline">
                {label}
            </a>
        </Badge>
    );
};
