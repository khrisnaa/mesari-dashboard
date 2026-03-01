export interface PaymentMethod {
    id: string;
    bank_name: string;
    account_number: string;
    account_owner: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
