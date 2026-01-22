import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { ArchiveDialog } from '@/components/product/archive-dialog';
import { getColumns } from '@/components/product/columns';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/products';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { Product } from '@/types/product';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '',
    },
];

interface PageProps {
    products: PaginatedResponse<Product>;
}

const Index = ({ products }: PageProps) => {
    const {
        isOpen: isArchiveOpen,
        open: openArchive,
        close: closeArchive,
        onOpenChange: onArchiveOpenChange,
        payload: archiveData,
    } = useDialog<Product>();

    const columns = getColumns(openArchive);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <FlashToast />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Products"
                    description="Track your products seamlessly, ensuring smooth organization and effortless control."
                    actions={
                        <Button asChild className="rounded-full" size="lg">
                            <Link href={create()}>
                                <Plus /> Create Product
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

            <ArchiveDialog
                isOpen={isArchiveOpen}
                close={closeArchive}
                onOpenChange={onArchiveOpenChange}
                payload={archiveData}
            />
        </AppLayout>
    );
};
export default Index;
