export interface CompanyProfile {
    id: string;
    company_name: string;
    tagline?: string | null;
    description?: string | null;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    google_map_url: string;
    working_hours: string;
    instagram?: string | null;
    tiktok?: string | null;
    facebook?: string | null;
    shopee?: string | null;
    tokopedia?: string | null;
    created_at: string;
    updated_at: string;
}
