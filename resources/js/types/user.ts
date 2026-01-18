export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export interface User {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    status: UserStatus;
    remember_token?: string | null;
    created_at: string;
    updated_at: string;
}
