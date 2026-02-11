// Components
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Forgot password"
            description="Enter your email to receive a password reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 rounded-md bg-green-50 p-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()} className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="name@example.com"
                                        className="pl-9"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                size="lg"
                                className="w-full rounded-full"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Email password reset link
                            </Button>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-muted-foreground">
                    <span>Or, return to </span>
                    <TextLink
                        href={login()}
                        className="font-medium underline-offset-4 hover:underline"
                    >
                        log in
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
