import { BannerType } from './enum';

export interface Banner {
    id: string;
    title: string | null;
    description: string | null;
    backdrop_path: string;
    image_path: string;
    cta_text: string | null;
    cta_link: string | null;
    cta_target_id: string | null;
    sort_order: number;
    is_published: boolean;
    cta_type: BannerType;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
