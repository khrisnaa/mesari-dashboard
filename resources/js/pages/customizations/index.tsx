import { getColumns } from '@/components/customization/columns';
import { EditDialog } from '@/components/customization/edit-dialog';
import { ShowDialog } from '@/components/customization/show-dialog';
import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Customization } from '@/types/customization';
import { PaginatedResponse } from '@/types/pagination';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customizations',
        href: '',
    },
];

interface PageProps {
    customizations: PaginatedResponse<Customization>;
}

const Index = ({ customizations }: PageProps) => {
    const {
        isOpen: isEditOpen,
        open: openEdit,
        close: closeEdit,
        onOpenChange: onEditOpenChange,
        payload: editData,
    } = useDialog<Customization>();

    const {
        isOpen: isShowOpen,
        open: openShow,
        close: closeShow,
        onOpenChange: onShowOpenChange,
        payload: showData,
    } = useDialog<Customization>();

    // const editRedirect = (item: Customization) => {
    //     router.get(`/customizations/${item.id}/edit`);
    // };

    const columns = getColumns(openShow, openEdit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customizations" />
            <FlashToast />

            <div className="container mx-auto flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Customizations"
                    description="Review, update, and manage all customer customization requests."
                />

                <DataTable
                    name="customizations"
                    columns={columns}
                    data={customizations.data}
                    pagination={(({ data, ...rest }) => rest)(customizations)}
                />
            </div>

            <ShowDialog
                isOpen={isShowOpen}
                close={closeShow}
                onOpenChange={onShowOpenChange}
                payload={showData}
            />
            <EditDialog
                isOpen={isEditOpen}
                close={closeEdit}
                onOpenChange={onEditOpenChange}
                payload={editData}
            />
        </AppLayout>
    );
};

export default Index;
