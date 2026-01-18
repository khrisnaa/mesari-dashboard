import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { BanDialog } from '@/components/user/ban-dialog';
import { getColumns } from '@/components/user/columns';
import { EditDialog } from '@/components/user/edit-dialog';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { User } from '@/types/user';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '',
    },
];

interface PageProps {
    users: PaginatedResponse<User>;
}

const Index = ({ users }: PageProps) => {
    const {
        isOpen: isEditOpen,
        open: openEdit,
        close: closeEdit,
        onOpenChange: onEditOpenChange,
        payload: editData,
    } = useDialog<User>();

    const {
        isOpen: isBanOpen,
        open: openBan,
        close: closeBan,
        onOpenChange: onBanOpenChange,
        payload: banData,
    } = useDialog<User>();

    const columns = getColumns(openEdit, openBan);

    console.log(users);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <FlashToast />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Users"
                    description="Manage application users and their access status."
                />

                <div className="container mx-auto">
                    <DataTable
                        name="users"
                        columns={columns}
                        data={users.data}
                        pagination={(({ data, ...rest }) => rest)(users)}
                    />
                </div>
            </div>

            <EditDialog
                isOpen={isEditOpen}
                close={closeEdit}
                onOpenChange={onEditOpenChange}
                payload={editData}
            />

            <BanDialog
                isOpen={isBanOpen}
                close={closeBan}
                onOpenChange={onBanOpenChange}
                payload={banData}
            />
        </AppLayout>
    );
};

export default Index;
