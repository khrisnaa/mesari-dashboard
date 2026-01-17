import { DataTable } from '@/components/data-table/data-table';
import { getColumns } from '@/components/faq/columns';
import { CreateDialog } from '@/components/faq/create-dialog';
import { DeleteDialog } from '@/components/faq/delete-dialog';
import { EditDialog } from '@/components/faq/edit-dialog';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Faq } from '@/types/faq';
import { PaginatedResponse } from '@/types/pagination';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'FAQs',
        href: '',
    },
];

interface PageProps {
    faqs: PaginatedResponse<Faq>;
}

const Index = ({ faqs }: PageProps) => {
    const {
        isOpen: isCreateOpen,
        open: openCreate,
        close: closeCreate,
        onOpenChange: onCreateOpenChange,
    } = useDialog();

    const {
        isOpen: isEditOpen,
        open: openEdit,
        close: closeEdit,
        onOpenChange: onEditOpenChange,
        payload: editData,
    } = useDialog<Faq>();

    const {
        isOpen: isDeleteOpen,
        open: openDelete,
        close: closeDelete,
        onOpenChange: onDeleteOpenChange,
        payload: deleteData,
    } = useDialog<Faq>();

    const columns = getColumns(openEdit, openDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faqs" />
            <FlashToast />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Faqs"
                    description="Manage your categories efficiently and keep your products organized."
                    actions={
                        <Button onClick={() => openCreate()}>
                            <Plus /> Create Faq
                        </Button>
                    }
                />

                <div className="container mx-auto">
                    <DataTable
                        name="faq"
                        columns={columns}
                        data={faqs.data}
                        pagination={(({ data, ...rest }) => rest)(faqs)}
                    />
                </div>
            </div>

            <CreateDialog
                isOpen={isCreateOpen}
                close={closeCreate}
                onOpenChange={onCreateOpenChange}
            />

            <EditDialog
                isOpen={isEditOpen}
                close={closeEdit}
                onOpenChange={onEditOpenChange}
                payload={editData}
            />

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
