import { columns } from '@/components/category/columns';
import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/categories';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { PaginatedResponse } from '@/types/pagination';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '',
    },
];

interface PageProps {
    categories: PaginatedResponse<Category>;
}

const Index = ({ categories }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <FlashToast />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Categories"
                    description="Manage your categories efficiently and keep your products organized."
                    actions={
                        <Button asChild>
                            <Link href={create()}>
                                <Plus /> Create category
                            </Link>
                        </Button>
                    }
                />
                <div className="container mx-auto">
                    <DataTable
                        name="category"
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
