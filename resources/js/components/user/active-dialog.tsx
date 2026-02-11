import users from '@/routes/users';
import { DialogComponentProps } from '@/types/dialog';
import { User } from '@/types/user';
import { Form } from '@inertiajs/react';
import { UserCheck, UserX, X } from 'lucide-react';
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

    const submitIcon = isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />;
    const submitLabel = isActive ? 'Deactivate User' : 'Activate User';

    const newStatus = !isActive;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...users.update.status.form(user)} disableWhileProcessing onSuccess={close}>
                    {({ processing }) => (
                        <>
                            <input type="hidden" name="is_active" value={newStatus ? '1' : '0'} />

                            <DialogFooter className="gap-2 sm:justify-end">
                                {/* Cancel */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 rounded-full"
                                    onClick={close}
                                    disabled={processing}
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>

                                {/* Submit */}
                                <SubmitButton
                                    processing={processing}
                                    variant={isActive ? 'destructive' : 'default'}
                                >
                                    <span className="flex items-center gap-2">
                                        {submitIcon}
                                        {submitLabel}
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
