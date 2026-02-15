import { Category } from './category';

export interface Product {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    description?: string;
    weight: number;
    is_published: boolean;
    is_customizable: boolean;
    custom_additional_price?: number;
    discount_type?: string;
    discount_value?: number;
    discount_start_at?: string;
    discount_end_at?: string;
    variants: ProductVariant[];
    category: Category;
    images: ProductImage[];
    total_stock?: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface ProductVariant {
    id: string;
    price: number;
    stock: number;
    product_id: string;
    attributes?: VariantAttribute[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface ProductVariantAttributePivot {
    product_variant_id: string;
    variant_attribute_id: string;
}

export interface VariantAttribute {
    id?: string;
    name: string;
    hex?: string | null;
    type?: 'color' | 'size';
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface ProductImage {
    id: string;
    path: string;
    type: 'gallery' | 'thumbnail';
    sort_order: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
