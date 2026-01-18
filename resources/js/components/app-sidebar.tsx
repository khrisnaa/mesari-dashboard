import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import banners from '@/routes/banners';
import categories from '@/routes/categories';
import companyProfile from '@/routes/company-profile';
import faqs from '@/routes/faqs';
import orders from '@/routes/orders';
import products from '@/routes/products';
import testimonials from '@/routes/testimonials';
import users from '@/routes/users';
import { type NavItemGroup } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpenIcon,
    Building2Icon,
    FolderIcon,
    HelpCircleIcon,
    ImageIcon,
    LayoutGridIcon,
    MessageSquareIcon,
    PackageIcon,
    ReceiptIcon,
    TagIcon,
    UserCogIcon,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavMain } from './nav-main';

const mainNavItems: NavItemGroup[] = [
    {
        heading: 'Dashboard',
        items: [{ title: 'Overview', href: dashboard(), icon: LayoutGridIcon }],
    },

    {
        heading: 'Catalog',
        items: [
            { title: 'Products', href: products.index(), icon: PackageIcon },
            { title: 'Categories', href: categories.index(), icon: TagIcon },
        ],
    },

    {
        heading: 'Content Management',
        items: [
            { title: 'Banners', href: banners.index(), icon: ImageIcon },
            { title: 'Testimonials', href: testimonials.index(), icon: MessageSquareIcon },
            { title: 'FAQs', href: faqs.index(), icon: HelpCircleIcon },
            { title: 'Company Profile', href: companyProfile.edit(), icon: Building2Icon },
        ],
    },

    {
        heading: 'User Management',
        items: [
            { title: 'Users', href: users.index(), icon: UserCogIcon },
            { title: 'Orders', href: orders.index(), icon: ReceiptIcon },
        ],
    },
];

const footerNavItems: NavItemGroup[] = [
    {
        heading: 'Developer',
        items: [
            {
                title: 'Repository',
                href: 'https://github.com/laravel/react-starter-kit',
                icon: FolderIcon,
            },
            {
                title: 'Documentation',
                href: 'https://laravel.com/docs/starter-kits#react',
                icon: BookOpenIcon,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {mainNavItems.map((group) => (
                    <NavMain key={group.heading} group={group} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                {/* {footerNavItems.map((group) => (
                    <NavFooter key={group.heading} group={group} className="mt-auto p-0" />
                ))} */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
