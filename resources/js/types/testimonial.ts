export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string | null;
    sort_order: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
