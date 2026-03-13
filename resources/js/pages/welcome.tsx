import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Admin Access">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
                <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-8">
                    <main className="flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:gap-24">
                        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                            <div className="mb-6 flex items-center justify-center rounded-2xl bg-primary/10 p-3 lg:justify-start">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>

                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                                Mesari Production <br />
                                <span className="text-muted-foreground">Admin Portal</span>
                            </h1>

                            <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                                Manage products, handle custom orders, and monitor business
                                performance for Mesari Production in one powerful dashboard.
                            </p>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                                    >
                                        Login to Admin
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>

                            <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold"
                                        >
                                            A{i}
                                        </div>
                                    ))}
                                </div>
                                <p>Mesari Production authorized personnel only.</p>
                            </div>
                        </div>

                        <div className="relative flex w-full flex-1 items-center justify-center lg:justify-end">
                            <div className="relative aspect-square w-full max-w-md rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/5 to-background p-8 lg:max-w-lg">
                                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

                                <div className="absolute top-1/4 left-4 z-20 w-48 rounded-xl border bg-card p-4 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl dark:bg-zinc-900">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-green-100 p-1.5 text-green-600">
                                            <ArrowRight className="h-full w-full rotate-[-45deg]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Sales</p>
                                            <p className="font-bold text-foreground">+ Rp 12.5M</p>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full w-[70%] bg-green-500" />
                                    </div>
                                </div>

                                <div className="absolute top-8 right-4 z-10 w-56 rounded-xl border bg-card p-4 shadow-lg dark:bg-zinc-900">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold">New Orders</h3>
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                            +12
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 rounded-lg bg-muted/50 p-2"
                                            >
                                                <div className="h-8 w-8 rounded-md bg-muted" />
                                                <div className="space-y-1">
                                                    <div className="h-2 w-16 rounded-full bg-muted-foreground/20" />
                                                    <div className="h-1.5 w-10 rounded-full bg-muted-foreground/10" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mockup Card 3 */}
                                <div className="absolute right-12 bottom-8 z-20 w-40 rounded-xl border bg-card p-4 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl dark:bg-zinc-900">
                                    <div className="mb-2 text-xs text-muted-foreground">
                                        Active Users
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <span className="text-2xl font-bold">2.4k</span>
                                        <div className="flex gap-0.5">
                                            <div className="h-3 w-1 rounded-full bg-primary/30" />
                                            <div className="h-5 w-1 rounded-full bg-primary/60" />
                                            <div className="h-8 w-1 rounded-full bg-primary" />
                                            <div className="h-4 w-1 rounded-full bg-primary/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
