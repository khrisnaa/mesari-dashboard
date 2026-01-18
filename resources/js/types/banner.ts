export interface Banner {
    id: string;
    title: string | null;
    description: string | null;
    backdrop_path: string;
    backdrop_url: string | null;
    image_path: string;
    image_url: string | null;
    cta_text: string | null;
    cta_link: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
