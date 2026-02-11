import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-md bg-green-50 p-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address you provided during
                    registration.
                </div>
            )}

            <Form {...send.form()} className="space-y-6">
                {({ processing }) => (
                    <div className="flex flex-col gap-4">
                        <Button size="lg" disabled={processing} className="w-full rounded-full">
                            {processing && <Spinner className="mr-2" />}
                            Resend verification email
                        </Button>

                        <div className="text-center text-sm text-muted-foreground">
                            <TextLink
                                href={logout()}
                                className="font-medium underline-offset-4 hover:underline"
                            >
                                Log out
                            </TextLink>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
