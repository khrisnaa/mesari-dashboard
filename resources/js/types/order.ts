import { OrderStatus, PaymentStatus } from './enum';
import { User } from './user';

export interface Order {
    id: string;
    user_id: string;

    order_number: string;

    order_status: OrderStatus;
    payment_status: PaymentStatus;

    // snapshot pricing
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    grand_total: number;

    // snapshot shipping
    shipping_courier_code: string;
    shipping_courier_service: string;
    shipping_estimation: string | null;
    shipping_tracking_number: string | null;

    // weight snapshot
    shipping_weight: number;

    // address snapshot
    recipient_name: string;
    recipient_phone: string;
    recipient_address_line: string;
    recipient_province: string;
    recipient_city: string;
    recipient_district: string;
    recipient_subdistrict: string | null;
    postal_code: string | null;

    note: string | null;

    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    // relations
    user?: User;
    items?: OrderItem[];
    payment?: Payment;
}

export interface OrderItem {
    id: string;
    order_id: string;
    customization_id: string | null;
    product_variant_id: string;

    product_name: string;
    variant_name: string;

    price: number;
    quantity: number;
    subtotal: number;

    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: string;
    order_id: string;

    midtrans_order_id: string | null;
    midtrans_transaction_id: string | null;
    snap_token: string | null;

    payment_type: string | null;
    transaction_status: string | null;
    fraud_status: string | null;
    status_code: string | null;

    gross_amount: number;

    transaction_time: string | null;
    settlement_time: string | null;

    signature_key: string | null;

    payload: any | null;

    payment_method_info: string | null;
    payment_proof: string | null;

    admin_note: string | null;

    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}
