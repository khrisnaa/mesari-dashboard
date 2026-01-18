import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User, UserStatus } from '@/types/user';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
                    <DialogTitle>Update User Status</DialogTitle>
                    <DialogDescription>
                        Only user status can be modified by admin.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...users.update.status.form(user)}
                    resetOnSuccess={['status']}
                    disableWhileProcessing
                    className="space-y-6"
                    onSuccess={close}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input value={user.name} disabled />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={user.email} disabled />
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

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select name="status" defaultValue={user.status}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UserStatus.ACTIVE}>
                                                Active
                                            </SelectItem>
                                            <SelectItem value={UserStatus.INACTIVE}>
                                                Inactive
                                            </SelectItem>
                                            <SelectItem value={UserStatus.SUSPENDED}>
                                                Suspended
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                <SubmitButton processing={processing}>Update Status</SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
