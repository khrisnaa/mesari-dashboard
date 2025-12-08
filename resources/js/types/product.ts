export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    variants: ProductVariant[];
    total_stock: number;
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

export interface AttributeType {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface Attribute {
    id: string;
    name: string;
    hex?: string | null;
    attribute_type_id: string;
    type?: AttributeType;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
