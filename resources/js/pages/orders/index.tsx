import { DataTable } from '@/components/data-table/data-table';

import FlashToast from '@/components/flash-toast';
import { getColumns } from '@/components/order/column';
import { EditDialog } from '@/components/order/edit-dialog';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Order } from '@/types/order';
import { PaginatedResponse } from '@/types/pagination';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '',
    },
];

interface PageProps {
    orders: PaginatedResponse<Order>;
}

const Index = ({ orders }: PageProps) => {
    const {
        isOpen: isEditOpen,
        open: openEdit,
        close: closeEdit,
        onOpenChange: onEditOpenChange,
        payload: editData,
    } = useDialog<Order>();

    const columns = getColumns(openEdit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <FlashToast />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Orders"
                    description="Manage and track all customer orders in one place."
                />

                <div className="container mx-auto">
                    <DataTable
                        name="orders"
                        columns={columns}
                        data={orders.data}
                        pagination={(({ data, ...rest }) => rest)(orders)}
                    />
                </div>
            </div>

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
