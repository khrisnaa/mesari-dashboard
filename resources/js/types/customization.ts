import { OrderStatus, PaymentStatus } from './enum';

export interface DesignElement {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    fill?: string;
    text?: string;
    scale: number;
    fontSize?: number;
    rotation: number;
    fontFamily?: string;
    url?: string;

    src?: string;
    width?: number;
    height?: number;
}

export interface CustomSide {
    has_design: boolean;
    mockup_url?: string;
    design_data?: DesignElement[];
}

export interface CustomDetails {
    front: CustomSide;
    back: CustomSide;
    leftSleeve: CustomSide;
    rightSleeve: CustomSide;
}

// Tambahkan interface ini untuk menampung data dari Controller
export interface BaseImages {
    front?: string | null;
    back?: string | null;
    leftSleeve?: string | null;
    rightSleeve?: string | null;
}

export interface Customization {
    id: string;
    user_id: string;
    product_id: string;
    product_variant_id: string;
    total_custom_sides: number;
    custom_details: CustomDetails;

    // Properti ini ditambahkan karena Controller mengirimkannya
    base_images?: BaseImages;

    additional_price: number;
    is_draft: boolean;
    created_at: string;
    updated_at: string;

    // Relations (Disarankan dipisah jika User/Product dipakai di tempat lain)
    user?: {
        id: string;
        name: string;
        email: string;
    };
    product?: {
        id: string;
        name: string;
        // Jika butuh mengakses relasi gambar aslinya secara utuh
        images?: Array<{ type: string; path: string }>;
    };
    product_variant?: {
        id: string;
        name: string;
        attributes: {
            name: string;
            type: string;
        }[];
    };
    order_item?: {
        id: string;
        order_id: string;
        price: number;
        quantity: number;
        subtotal: number;
        order: {
            id: string;
            order_number: string;
            order_status: OrderStatus;
            payment_status: PaymentStatus;
            created_at: string;
        };
    };
}
