export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    is_published: boolean;
    remember_token?: string | null;
    created_at: string;
    updated_at: string;
}
