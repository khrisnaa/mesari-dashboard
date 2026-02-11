import { getColumns } from '@/components/category/columns';
import { CreateDialog } from '@/components/category/create-dialog';
import { DeleteDialog } from '@/components/category/delete-dialog';
import { EditDialog } from '@/components/category/edit-dialog';
import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { PaginatedResponse } from '@/types/pagination';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '',
    },
];

interface PageProps {
    categories: PaginatedResponse<Category>;
}

const Index = ({ categories }: PageProps) => {
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
    } = useDialog<Category>();

    const {
        isOpen: isDeleteOpen,
        open: openDelete,
        close: closeDelete,
        onOpenChange: onDeleteOpenChange,
        payload: deleteData,
    } = useDialog<Category>();

    const columns = getColumns(openEdit, openDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <FlashToast />

            <div className="container mx-auto flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Categories"
                    description="Manage your categories efficiently and keep your products organized."
                    actions={
                        <Button className="rounded-full" size="lg" onClick={() => openCreate()}>
                            <Plus /> Create Category
                        </Button>
                    }
                />

                <DataTable
                    name="category"
                    columns={columns}
                    data={categories.data}
                    pagination={(({ data, ...rest }) => rest)(categories)}
                />
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
