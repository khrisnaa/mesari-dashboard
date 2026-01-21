import { Category } from './category';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: 'draft' | 'published' | 'archived';
    variants: ProductVariant[];
    category: Category;
    images: ProductImage[];
    discount?: ProductDiscount;
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
    attributes?: Attribute[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface ProductVariantAttributePivot {
    product_variant_id: string;
    attribute_id: string;
}

export interface Attribute {
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

export interface ProductDiscount {
    id: string;
    product_id: string;
    type: 'percentage' | 'fixed';
    value: number;
    start_at?: string | null;
    end_at?: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
