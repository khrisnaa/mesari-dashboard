import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { getColumns } from '@/components/payment-methods/columns';
import { DeleteDialog } from '@/components/payment-methods/delete-dialog';
import { EditDialog } from '@/components/payment-methods/edit-dialog';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { PaymentMethod } from '@/types/payment-method';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Methods',
        href: '',
    },
];

interface PageProps {
    methods: PaginatedResponse<PaymentMethod>;
}

const Index = ({ methods }: PageProps) => {
    const {
        isOpen: isEditOpen,
        open: openEdit,
        close: closeEdit,
        onOpenChange: onEditOpenChange,
        payload: editData,
    } = useDialog<PaymentMethod>();

    const {
        isOpen: isDeleteOpen,
        open: openDelete,
        close: closeDelete,
        onOpenChange: onDeleteOpenChange,
        payload: deleteData,
    } = useDialog<PaymentMethod>();

    const columns = getColumns(openEdit, openDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Methods" />
            <FlashToast />

            <div className="container mx-auto flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Payment Methods"
                    description="Manage available banks and payment accounts used by customers during checkout."
                />

                <DataTable
                    name="payment-methods"
                    columns={columns}
                    data={methods.data}
                    pagination={(({ data, ...rest }) => rest)(methods)}
                />
            </div>

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
