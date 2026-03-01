export interface ProductReview {
    id: string;
    product_id: string;
    order_item_id: string;
    rating: number;
    title: string | null;
    content: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;

    product?: {
        id: string;
        name: string;
    };
}
