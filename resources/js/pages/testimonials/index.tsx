import { DataTable } from '@/components/data-table/data-table';
import FlashToast from '@/components/flash-toast';
import { PageHeader } from '@/components/page-header';
import { getColumns } from '@/components/testimonial/columns';
import { CreateDialog } from '@/components/testimonial/create-dialog';
import { DeleteDialog } from '@/components/testimonial/delete-dialog';
import { EditDialog } from '@/components/testimonial/edit-dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/pagination';
import { Testimonial } from '@/types/testimonial';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Testimonials',
        href: '',
    },
];

interface PageProps {
    testimonials: PaginatedResponse<Testimonial>;
}

const Index = ({ testimonials }: PageProps) => {
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
    } = useDialog<Testimonial>();

    const {
        isOpen: isDeleteOpen,
        open: openDelete,
        close: closeDelete,
        onOpenChange: onDeleteOpenChange,
        payload: deleteData,
    } = useDialog<Testimonial>();

    const columns = getColumns(openEdit, openDelete);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials" />
            <FlashToast />

            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Testimonials"
                    description="Manage customer testimonials to build trust and improve credibility."
                    actions={
                        <Button className="rounded-full" size="lg" onClick={() => openCreate()}>
                            <Plus /> Create Testimonial
                        </Button>
                    }
                />

                <div className="container mx-auto">
                    <DataTable
                        name="faq"
                        columns={columns}
                        data={testimonials.data}
                        pagination={(({ data, ...rest }) => rest)(testimonials)}
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
