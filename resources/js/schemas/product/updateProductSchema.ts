import { z } from 'zod';

const AttributeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    hex: z
        .string()
        .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
            message: 'Invalid HEX color (example: #FF5733)',
        })
        .nullable()
        .optional(),
});

const VariantSchema = z.object({
    size: AttributeSchema.optional(),
    color: AttributeSchema.optional(),
    price: z.number().min(0, 'Price must be 0 or greater').optional(),
    stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative').optional(),
});

const ImageSchema = z.object({
    id: z.string().optional(),
    type: z.enum(['thumbnail', 'gallery']).optional(),
});

export const updateProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Product name is required')
        .max(150, 'Product name must not exceed 150 characters'),
    description: z
        .string()
        .trim()
        .max(2000, 'Description must not exceed 2000 characters')
        .optional(),
    base_price: z.number().optional(),
    base_stock: z.number().optional(),
    variants: z
        .array(VariantSchema)
        .max(200, 'Too many variants')
        .refine(
            (variants) => {
                if (!variants || variants.length === 0) return true; // skip jika tidak ada update variant

                const combos = variants.map((v) => {
                    const size = v.size?.name?.trim().toLowerCase() || '';
                    const color = v.color?.name?.trim().toLowerCase() || '';
                    return color ? `${size}-${color}` : size;
                });

                return new Set(combos).size === combos.length;
            },
            {
                message:
                    'Duplicate variant combination is not allowed (same size or same size & color)',
            },
        )
        .optional(),
    images: z.array(ImageSchema).max(20, 'Too many images').optional(),
    category_id: z.string().min(1, 'Product category is required'),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
