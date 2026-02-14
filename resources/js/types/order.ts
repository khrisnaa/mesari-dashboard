import { OrderStatus, PaymentStatus } from './enum';
import { User } from './user';

export interface Order {
    id: string;
    user_id: string;

    order_status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: string | null;

    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    grand_total: number;

    shipping_courier_code: string;
    shipping_courier_service: string;
    shipping_estimation: string | null;
    shipping_weight_grams: number;
    tracking_number: string | null;

    created_at: string;
    updated_at: string;

    user?: User;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_variant_id: string;

    product_name: string;
    variant_name: string;

    price: number;
    quantity: number;
    subtotal: number;

    created_at: string;
    updated_at: string;
}
