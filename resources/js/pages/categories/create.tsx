import { InputDescription } from '@/components/input-description';
import InputError from '@/components/input-error';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import categories from '@/routes/categories';
import { BreadcrumbItem } from '@/types';
import { Category } from '@/types/category';
import { Form, Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Create',
        href: '/categories/create',
    },
];

interface PageProps {
    categories: Category[];
}
const Create = ({ categories: categoriesData }: PageProps) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Category" />
            <div className="mx-auto flex h-full w-full max-w-1/2 flex-1 flex-col gap-8 rounded-xl p-4">
                <PageHeader
                    title="Create Category"
                    description="Add a new category to organize your products efficiently."
                />

                <div className="gap-4 rounded-md border p-4">
                    <Form
                        {...categories.store.form()}
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
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            autoFocus
                                            autoComplete="description"
                                            name="description"
                                            placeholder="Category description"
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="parent_id">
                                            Parent
                                        </Label>
                                        <Select name="parent_id">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Parent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoriesData.map(
                                                    (category, i) => (
                                                        <SelectItem
                                                            key={i}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputDescription>
                                            Set parent if your category is
                                            sub-category
                                        </InputDescription>
                                        <InputError
                                            message={errors.parent_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 w-full"
                                        tabIndex={5}
                                    >
                                        {processing && <Spinner />}
                                        Create category
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
export default Create;
