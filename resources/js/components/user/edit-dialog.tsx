import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User } from '@/types/user';
import { Form } from '@inertiajs/react';
import { SubmitButton } from '../buttons/submit-button';
import InputError from '../input-error';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export const EditDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: user,
}: DialogComponentProps<User>) => {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Admin can modify basic user information and account status.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...users.update.form(user)}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={user.name}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="off"
                                        defaultValue={user.email}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        autoComplete="off"
                                        defaultValue={user.phone ?? ''}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email Verified</Label>
                                    <Input
                                        value={user.email_verified_at ?? 'Not Verified'}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Created At</Label>
                                    <Input value={user.created_at} disabled />
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center gap-2">
                                        <input type="hidden" name="is_active" value="0" />

                                        <Switch
                                            id="is_active"
                                            name="is_active"
                                            value="1"
                                            defaultChecked={user.is_active}
                                        />

                                        <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                <SubmitButton processing={processing}>Update</SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
