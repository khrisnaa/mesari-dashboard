import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Create',
        href: '/products/create',
    },
];

const Create = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="p-4">
                <PageHeader
                    title="Create Product"
                    description="Add a new product to organize your products efficiently."
                />
            </div>
        </AppLayout>
    );
};
export default Create;
