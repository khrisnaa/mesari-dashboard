import { getColumns } from '@/components/banner/columns';
import { DeleteDialog } from '@/components/banner/delete-dialog';
import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/banners';
import { BreadcrumbItem } from '@/types';
import { Banner } from '@/types/banner';
import { PaginatedResponse } from '@/types/pagination';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banners',
        href: '',
    },
];

interface PageProps {
    banners: PaginatedResponse<Banner>;
}

const Index = ({ banners }: PageProps) => {
    const {
        isOpen: isDeleteOpen,
        open: openDelete,
        close: closeDelete,
        onOpenChange: onDeleteOpenChange,
        payload: deleteData,
    } = useDialog<Banner>();

    const columns = getColumns(openDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banners" />
            <FlashToast />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Banners"
                    description="Manage homepage banners and promotional content."
                    actions={
                        <Button asChild>
                            <Link href={create()}>
                                <Plus /> Create Banner
                            </Link>
                        </Button>
                    }
                />

                <div className="container mx-auto">
                    <DataTable
                        name="banner"
                        columns={columns}
                        data={banners.data}
                        pagination={(({ data, ...rest }) => rest)(banners)}
                    />
                </div>
            </div>

            <DeleteDialog
                isOpen={isDeleteOpen}
                close={closeDelete}
                onOpenChange={onDeleteOpenChange}
                payload={deleteData}
            />
        </AppLayout>
    );
};

export default Index;
