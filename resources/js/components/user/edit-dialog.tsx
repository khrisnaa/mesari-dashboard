import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User } from '@/types/user';
import { Form } from '@inertiajs/react';
import { Save, X } from 'lucide-react';
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
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user details and manage account status.
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
                            <div className="grid gap-4 py-2">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={user.name}
                                            autoComplete="off"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={user.email}
                                            autoComplete="off"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        defaultValue={user.phone ?? ''}
                                        autoComplete="off"
                                        placeholder="08123456789"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col justify-start space-y-2">
                                        <div className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="space-y-0.5">
                                                <Label
                                                    htmlFor="email_verified_at"
                                                    className="cursor-pointer"
                                                >
                                                    Verification Status
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email_verified_at
                                                        ? `Verified at ${user.email_verified_at.substring(0, 10)}`
                                                        : 'Manually verify this user.'}
                                                </p>
                                            </div>

                                            <input
                                                type="hidden"
                                                name="email_verified_at"
                                                value="0"
                                            />
                                            <Switch
                                                id="email_verified_at"
                                                name="email_verified_at"
                                                value="1"
                                                defaultChecked={!!user.email_verified_at}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Created At</Label>
                                        <Input
                                            value={user.created_at}
                                            disabled
                                            className="bg-muted text-muted-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-start space-y-2">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active" className="cursor-pointer">
                                                Active Status
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Enable or disable this user account.
                                            </p>
                                        </div>
                                        <input type="hidden" name="is_active" value="0" />
                                        <Switch
                                            id="is_active"
                                            name="is_active"
                                            value="1"
                                            defaultChecked={user.is_active}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={close}
                                    disabled={processing}
                                    size="lg"
                                    className="gap-2 rounded-full"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>

                                <SubmitButton processing={processing}>
                                    <span className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Update User
                                    </span>
                                </SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
