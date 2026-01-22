import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/company-profile';
import { BreadcrumbItem } from '@/types';
import { CompanyProfile } from '@/types/company-profile';
import { Head, Link } from '@inertiajs/react';
import { PencilIcon } from 'lucide-react';

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

            <div className="flex h-full w-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Company Profile"
                    description="Detail informasi perusahaan."
                    actions={
                        <Button asChild className="rounded-full" size="lg">
                            <Link href={edit()}>
                                <PencilIcon /> Edit Profile
                            </Link>
                        </Button>
                    }
                />

                <div className="space-y-4">
                    <Section label="Company Name" value={profile.company_name} />

                    {profile.tagline && <Section label="Tagline" value={profile.tagline} />}

                    <Section label="Description" value={profile.description ?? '-'} multiline />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Section label="Email" value={profile.email} />
                    <Section label="Phone" value={profile.phone} />
                    <Section label="WhatsApp" value={profile.whatsapp} />
                    <Section label="Working Hours" value={profile.working_hours} />
                </div>

                <Separator />

                <div className="space-y-4">
                    <Section
                        label="Address"
                        value={`${profile.address}, ${profile.city}, ${profile.province} ${profile.postal_code}`}
                    />

                    <Link
                        href={profile.google_map_url}
                        target="_blank"
                        className="text-sm text-primary hover:underline"
                    >
                        View on Google Maps
                    </Link>
                </div>

                <Separator />

                <div className="space-y-4">
                    <Label className="text-sm text-muted-foreground">Social Media</Label>

                    <div className="flex flex-wrap gap-2">
                        <SocialBadge label="Instagram" value={profile.instagram} />
                        <SocialBadge label="TikTok" value={profile.tiktok} />
                        <SocialBadge label="Facebook" value={profile.facebook} />
                        <SocialBadge label="Shopee" value={profile.shopee} />
                        <SocialBadge label="Tokopedia" value={profile.tokopedia} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;

const Section = ({
    label,
    value,
    multiline = false,
}: {
    label: string;
    value: string;
    multiline?: boolean;
}) => (
    <div className="space-y-1">
        <Label className="text-sm">{label}</Label>
        <p className={multiline ? 'max-w-4xl text-sm whitespace-pre-line' : 'text-sm'}>{value}</p>
    </div>
);

const SocialBadge = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return <Badge variant="secondary">{label}</Badge>;

    return (
        <Badge asChild className="px-4 py-2">
            <Link href={value} target="_blank" className="hover:underline">
                {label}
            </Link>
        </Badge>
    );
};
