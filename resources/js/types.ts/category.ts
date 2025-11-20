export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    parent_id?: string | null;
    parent?: Category;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
