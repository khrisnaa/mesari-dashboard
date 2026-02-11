import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';
import { Form, Head } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    autoFocus
                                    className="pl-9"
                                />
                            </div>

                            <InputError message={errors.password} />
                        </div>

                        <Button
                            size="lg"
                            className="w-full rounded-full"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Confirm password
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
