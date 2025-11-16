export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    size?: string;
    color?: string;
    stock: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
