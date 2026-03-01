import { DataTable } from '@/components/data-table/data-table';

import FlashToast from '@/components/flash-toast';
import { getColumns } from '@/components/order/columns';
import { EditDialog } from '@/components/order/edit-dialog';
import { ShowDialog } from '@/components/order/show-dialog';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Order } from '@/types/order';
import { PaginatedResponse } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';

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

    const {
        isOpen: isShowOpen,
        open: openShow,
        close: closeShow,
        onOpenChange: onShowOpenChange,
        payload: showData,
    } = useDialog<Order>();

    const editRedirect = (order: Order) => {
        router.get(`/orders/${order.id}/edit`);
    };

    const columns = getColumns(editRedirect, openShow);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <FlashToast />

            <div className="container mx-auto flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Orders"
                    description="Manage and track all customer orders in one place."
                />

                <DataTable
                    name="orders"
                    columns={columns}
                    data={orders.data}
                    pagination={(({ data, ...rest }) => rest)(orders)}
                />
            </div>

            <EditDialog
                isOpen={isEditOpen}
                close={closeEdit}
                onOpenChange={onEditOpenChange}
                payload={editData}
            />
            <ShowDialog
                isOpen={isShowOpen}
                close={closeShow}
                onOpenChange={onShowOpenChange}
                payload={showData}
            />
        </AppLayout>
    );
};

export default Index;
