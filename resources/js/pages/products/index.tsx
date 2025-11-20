import { DataTable } from '@/components/data-table/data-table';
import { columns } from '@/components/product/columns';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types.ts/pagination';
import { Product } from '@/types.ts/product';
import { Head } from '@inertiajs/react';

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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex w-full items-end justify-between">
                    <div className="flex-1">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Products
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Track your products seamlessly, ensuring smooth
                                organization and effortless control.
                            </p>
                        </div>
                    </div>
                </div>
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
