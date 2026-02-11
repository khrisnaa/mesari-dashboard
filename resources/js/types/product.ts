import { Category } from './category';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    is_published: boolean;
    variants: ProductVariant[];
    category: Category;
    images: ProductImage[];
    total_stock?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
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
