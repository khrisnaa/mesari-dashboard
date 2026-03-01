import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ActiveDialog } from '@/components/user/active-dialog';
import { getColumns } from '@/components/user/columns';
import { EditDialog } from '@/components/user/edit-dialog';
import { InviteDialog } from '@/components/user/invite-dialog';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { User } from '@/types/user';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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
        isOpen: isActiveOpen,
        open: openActive,
        close: closeActive,
        onOpenChange: onActiveOpenChange,
        payload: activeData,
    } = useDialog<User>();

    const {
        isOpen: isInviteOpen,
        open: openInvite,
        close: closeInvite,
        onOpenChange: onInviteOpenChange,
    } = useDialog<User>();

    const columns = getColumns(openEdit, openActive);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <FlashToast />

            <div className="container mx-auto flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Users"
                    description="Manage application users and their access status."
                    actions={
                        <Button className="rounded-full" size="lg" onClick={() => openInvite()}>
                            <Plus /> Invite Admin
                        </Button>
                    }
                />

                <DataTable
                    name="users"
                    columns={columns}
                    data={users.data}
                    pagination={(({ data, ...rest }) => rest)(users)}
                />
            </div>

            <EditDialog
                isOpen={isEditOpen}
                close={closeEdit}
                onOpenChange={onEditOpenChange}
                payload={editData}
            />

            <ActiveDialog
                isOpen={isActiveOpen}
                close={closeActive}
                onOpenChange={onActiveOpenChange}
                payload={activeData}
            />

            <InviteDialog
                isOpen={isInviteOpen}
                close={closeInvite}
                onOpenChange={onInviteOpenChange}
            />
        </AppLayout>
    );
};

export default Index;
