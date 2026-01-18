import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User, UserStatus } from '@/types/user';
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

export const BanDialog = ({
    isOpen,
    close,
    onOpenChange,
    payload: user,
}: DialogComponentProps<User>) => {
    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-sm">
                <DialogHeader>
                    <DialogTitle>Suspend User</DialogTitle>
                    <DialogDescription>
                        This action will suspend the user. The user will not be able to log in until
                        their status is restored. Are you sure you want to continue?
                    </DialogDescription>
                </DialogHeader>

                <Form {...users.update.status.form(user)} disableWhileProcessing onSuccess={close}>
                    {({ processing }) => (
                        <>
                            <input type="hidden" name="status" value={UserStatus.SUSPENDED} />
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>

                                <SubmitButton processing={processing} variant="destructive">
                                    Suspend User
                                </SubmitButton>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};
