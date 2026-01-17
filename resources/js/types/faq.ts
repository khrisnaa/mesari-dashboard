export interface Faq {
    id: string;
    question: string;
    answer: string;
    sort_order: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
