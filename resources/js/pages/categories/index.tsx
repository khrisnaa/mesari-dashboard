import { columns } from '@/components/category/columns';
import { DataTable } from '@/components/data-table/data-table';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types.ts/category';
import { PaginatedResponse } from '@/types.ts/pagination';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/Categories',
    },
];

interface PageProps {
    categories: PaginatedResponse<Category>;
}

const Index = ({ categories }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Categories"
                    description="Manage your categories efficiently and keep your products organized."
                    actions={
                        <Button>
                            <Plus /> Create Category
                        </Button>
                    }
                />
                <div className="container mx-auto">
                    <DataTable
                        columns={columns}
                        data={categories.data}
                        pagination={(({ data, ...rest }) => rest)(categories)}
                    />
                </div>
            </div>
        </AppLayout>
    );
};
export default Index;
