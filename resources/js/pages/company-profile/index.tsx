import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { edit } from '@/routes/company-profile';
import { BreadcrumbItem } from '@/types';
import { CompanyProfile } from '@/types/company-profile';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Clock,
    Facebook,
    Globe,
    Instagram,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Smartphone,
    Twitter,
} from 'lucide-react';
import { ReactNode } from 'react';

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

            <div className="container mx-auto space-y-8 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {profile.company_name}
                        </h1>
                        <p className="text-muted-foreground">
                            {profile.tagline || 'Detailed information about your company.'}
                        </p>
                    </div>
                    <Button asChild size="lg" className="rounded-full">
                        <Link href={edit()}>
                            <Pencil className="h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    About Company
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="leading-relaxed whitespace-pre-line">
                                        {profile.description || '-'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {profile.address},{' '}
                                    {profile.subdistrict_name && `${profile.subdistrict_name}, `}
                                    {profile.district_name && `${profile.district_name}, `}
                                    {profile.city_name}, {profile.province_name}{' '}
                                    {profile.postal_code}
                                </p>
                                {profile.google_map_url && (
                                    <div className="space-y-3">
                                        <div className="rounded-md border bg-muted/50 p-3">
                                            <Link
                                                href={profile.google_map_url}
                                                target="_blank"
                                                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                            >
                                                <Globe className="h-4 w-4" />
                                                View on Google Maps
                                            </Link>
                                        </div>
                                        <div className="overflow-hidden rounded-md border">
                                            <iframe
                                                title="Company Location"
                                                width="100%"
                                                height="300"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                                    `${profile.address}, ${profile.city_name}`,
                                                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle className="text-base">Contact & Operations</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <InfoItem
                                    icon={<Mail className="h-4 w-4" />}
                                    label="Email"
                                    value={profile.email}
                                />
                                <InfoItem
                                    icon={<Phone className="h-4 w-4" />}
                                    label="Phone"
                                    value={profile.phone}
                                />
                                <InfoItem
                                    icon={<Smartphone className="h-4 w-4" />}
                                    label="WhatsApp"
                                    value={profile.whatsapp}
                                />
                                <Separator />
                                <InfoItem
                                    icon={<Clock className="h-4 w-4" />}
                                    label="Working Hours"
                                    value={profile.working_hours}
                                />
                            </CardContent>
                        </Card>

                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle className="text-base">Social Media</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-3">
                                    <SocialLink
                                        icon={<Instagram className="h-4 w-4" />}
                                        label="Instagram"
                                        value={profile.instagram}
                                        color="text-pink-600"
                                    />
                                    <SocialLink
                                        icon={<Twitter className="h-4 w-4" />}
                                        label="TikTok"
                                        value={profile.tiktok}
                                        color="text-black dark:text-white"
                                    />
                                    <SocialLink
                                        icon={<Facebook className="h-4 w-4" />}
                                        label="Facebook"
                                        value={profile.facebook}
                                        color="text-blue-600"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;

const InfoItem = ({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value?: string | null;
}) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground">
            {icon}
        </div>
        <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground">{value || '-'}</span>
        </div>
    </div>
);

const SocialLink = ({
    icon,
    label,
    value,
    color,
}: {
    icon: ReactNode;
    label: string;
    value?: string | null;
    color?: string;
}) => {
    if (!value) return null;

    return (
        <Button
            variant="outline"
            asChild
            className="w-full justify-start gap-3 border-dashed hover:border-solid hover:bg-muted/50"
        >
            <Link href={value} target="_blank">
                <span className={color}>{icon}</span>
                <span>{label}</span>
            </Link>
        </Button>
    );
};
