export enum VariantAttributeType {
    COLOR = 'color',
    SIZE = 'size',
}

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

export enum ImageType {
    THUMBNAIL = 'thumbnail',
    GALLERY = 'gallery',
    FRONT = 'front',
    BACK = 'back',
    LEFT = 'left',
    RIGHT = 'right',
}

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PACKED = 'packed',
    SHIPPED = 'shipped',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    WAITING_APPROVAL = 'waiting_approval',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    WAITING_APPROVAL = 'waiting_approval',
}

export enum BannerType {
    NONE = 'none',
    PRODUCT = 'product',
    CATEGORY = 'category',
    PRODUCTS = 'products',
    EXTERNAL = 'external',
}
