import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User } from '@/types/user';
import { Form } from '@inertiajs/react';
import { Send, X } from 'lucide-react';
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

export const InviteDialog = ({
    isOpen,
    close,
    onOpenChange,
}: Omit<DialogComponentProps<User>, 'payload'>) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Invite Admin</DialogTitle>
                    <DialogDescription>
                        Send an invitation email to a new admin to join the dashboard.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...users.invite.form()}
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
                                            autoComplete="off"
                                            placeholder="Enter full name"
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
                                            placeholder="admin@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        autoComplete="off"
                                        placeholder="e.g. +62..."
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="flex flex-col justify-start space-y-2">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active" className="cursor-pointer">
                                                Active Status
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Enable or disable this user account upon
                                                registration.
                                            </p>
                                        </div>
                                        <input type="hidden" name="is_active" value="0" />
                                        <Switch
                                            id="is_active"
                                            name="is_active"
                                            value="1"
                                            defaultChecked={true}
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
                                        <Send className="h-4 w-4" />
                                        Send Invitation
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
