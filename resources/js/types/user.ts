export interface User {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    is_active: boolean;
    remember_token?: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export interface Role {
    id: number | string;
    name: string;
    guard_name: string;
    created_at?: string;
    updated_at?: string;

    pivot?: {
        model_type: string;
        model_id: number | string;
        role_id: number | string;
    };
}
