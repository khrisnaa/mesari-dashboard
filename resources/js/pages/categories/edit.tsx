import FlashToast from '@/components/flash-toast';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import categories from '@/routes/categories';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { Form, Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: categories.index(),
    },
    {
        title: 'Edit',
        href: '',
    },
];

interface PageProps {
    category: Category;
}

const Edit = ({ category }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />
            <FlashToast />
            <div className="mx-auto flex h-full w-full max-w-1/2 flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Edit Category"
                    description="Update the category details to keep your catalog organized."
                />

                <div className="gap-4 rounded-md border p-4">
                    <Form
                        {...categories.update.form(category.id)}
                        resetOnSuccess={['name', 'description']}
                        disableWhileProcessing
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Category name"
                                            defaultValue={category.name}
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>
                                    <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                        {processing && <Spinner />}
                                        Save changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
};
export default Edit;
