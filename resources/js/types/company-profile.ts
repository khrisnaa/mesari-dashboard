export interface CompanyProfile {
    id: string;
    company_name: string;
    tagline?: string | null;
    description?: string | null;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    origin_id: number;
    province_name: string;
    city_name: string;
    district_name?: string | null;
    subdistrict_name?: string | null;
    postal_code: string;
    google_map_url: string;
    working_hours: string;
    instagram?: string | null;
    tiktok?: string | null;
    facebook?: string | null;
    created_at: string;
    updated_at: string;
}
