import { OrderStatus, PaymentStatus } from './enum';
import { User } from './user';

export interface Order {
    id: string;
    user_id: string;
    order_status: OrderStatus;
    subtotal: number;
    total: number;
    payment_method: string;
    payment_status: PaymentStatus;
    shipping_courier: string;
    shipping_service: string;
    shipping_cost: number;
    shipping_weight: number;
    shipping_etd: string;
    created_at: string;
    updated_at: string;

    user?: User;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_variant_id: string;
    product_name: string;
    variant_name: string;
    price: number;
    quantity: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
}
