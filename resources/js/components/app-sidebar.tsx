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
import customizations from '@/routes/customizations';
import faqs from '@/routes/faqs';
import orders from '@/routes/orders';
import paymentMethods from '@/routes/payment-methods';
import productReviews from '@/routes/product-reviews';
import products from '@/routes/products';
import testimonials from '@/routes/testimonials';
import users from '@/routes/users';
import { type NavItemGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpenIcon,
    Building2Icon,
    CreditCardIcon,
    FolderIcon,
    HelpCircleIcon,
    ImageIcon,
    LayoutGridIcon,
    MessageSquareIcon,
    PackageIcon,
    QuoteIcon,
    ReceiptIcon,
    ScissorsIcon,
    TagIcon,
    UserCogIcon,
} from 'lucide-react';
import AppLogo from './app-logo';
import { NavMain } from './nav-main';

const getMainNavItems = (isSuperAdmin: boolean): NavItemGroup[] => [
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
            ...(isSuperAdmin
                ? [{ title: 'Company Profile', href: companyProfile.index(), icon: Building2Icon }]
                : []),
            { title: 'Banners', href: banners.index(), icon: ImageIcon },
            { title: 'Testimonials', href: testimonials.index(), icon: QuoteIcon },
            { title: 'FAQs', href: faqs.index(), icon: HelpCircleIcon },
            { title: 'Product Reviews', href: productReviews.index(), icon: MessageSquareIcon },
        ],
    },
    {
        heading: 'Order',
        items: [
            { title: 'Orders', href: orders.index(), icon: ReceiptIcon },
            { title: 'Customizations', href: customizations.index(), icon: ScissorsIcon },
            ...(isSuperAdmin
                ? [{ title: 'Bank Accounts', href: paymentMethods.index(), icon: CreditCardIcon }]
                : []),
        ],
    },
    ...(isSuperAdmin
        ? [
              {
                  heading: 'User Management',
                  items: [{ title: 'Users', href: users.index(), icon: UserCogIcon }],
              },
          ]
        : []),
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
    const { auth } = usePage().props as any;
    const userRoles: string[] = auth?.user?.roles || [];
    const isSuperAdmin = userRoles.includes('superadmin');

    const mainNavItems = getMainNavItems(isSuperAdmin);

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
