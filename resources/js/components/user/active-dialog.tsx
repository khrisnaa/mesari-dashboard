import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User } from '@/types/user';
import { Form } from '@inertiajs/react';
import { SubmitButton } from '../buttons/submit-button';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

export const ActiveDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: user,
}: DialogComponentProps<User>) => {
    if (!user) return null;

    const isActive = user.is_active;

    const title = isActive ? 'Deactivate User' : 'Activate User';
    const description = isActive
        ? 'This action will deactivate this user. They will not be able to log in. Are you sure you want to continue?'
        : 'This action will activate this user. They will be able to log in again. Are you sure you want to continue?';

    const newStatus = !isActive;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...users.update.status.form(user)} disableWhileProcessing onSuccess={close}>
                    {({ processing }) => (
                        <>
                            <input type="hidden" name="is_active" value={newStatus ? '1' : '0'} />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                <SubmitButton
                                    processing={processing}
                                    variant={isActive ? 'destructive' : 'default'}
                                >
                                    {isActive ? 'Deactivate User' : 'Activate User'}
                                </SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
