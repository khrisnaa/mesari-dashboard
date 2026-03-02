import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { getColumns } from '@/components/payment-methods/columns';
import { CreateDialog } from '@/components/payment-methods/create-dialog';
import { DeleteDialog } from '@/components/payment-methods/delete-dialog';
import { EditDialog } from '@/components/payment-methods/edit-dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { PaymentMethod } from '@/types/payment-method';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bank Accounts',
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

    const {
        isOpen: isCreateOpen,
        open: openCreate,
        close: closeCreate,
        onOpenChange: onCreateOpenChange,
        payload: createData,
    } = useDialog<PaymentMethod>();

    const columns = getColumns(openEdit, openDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bank Accounts" />
            <FlashToast />

            <div className="container mx-auto flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Bank Accounts"
                    description="Manage available banks and payment accounts used by customers during checkout."
                    actions={
                        <Button className="rounded-full" size="lg" onClick={() => openCreate()}>
                            <Plus /> Create Bank Account
                        </Button>
                    }
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

            <CreateDialog
                isOpen={isCreateOpen}
                close={closeCreate}
                onOpenChange={onCreateOpenChange}
            />
        </AppLayout>
    );
};

export default Index;
