import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/page-header';
import { columns } from '@/components/product/columns';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { Product } from '@/types/product';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface PageProps {
    products: PaginatedResponse<Product>;
}

const Index = ({ products }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Products"
                    description="Track your products seamlessly, ensuring smooth organization and effortless control."
                    actions={
                        <Button asChild>
                            <Link href="/products/create">
                                <Plus /> Create product
                            </Link>
                        </Button>
                    }
                />
                <div className="container mx-auto">
                    <DataTable
                        columns={columns}
                        data={products.data}
                        pagination={(({ data, ...rest }) => rest)(products)}
                    />
                </div>
            </div>
        </AppLayout>
    );
};
export default Index;
