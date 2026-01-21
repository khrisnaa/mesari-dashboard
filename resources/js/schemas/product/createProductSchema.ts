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
    size: AttributeSchema,
    color: AttributeSchema.optional(),
    price: z.number().min(0, 'Price must be 0 or greater'),
    stock: z.number().int('Stock must be an integer').min(0, 'Stock cannot be negative'),
});

const ImageSchema = z.object({
    type: z.enum(['thumbnail', 'gallery']),
});

export const createProductSchema = z.object({
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
    selected_sizes: z.array(z.string().min(1)).nonempty('Select at least one size'),
    variants: z
        .array(VariantSchema)
        .min(1, 'At least one variant is required')
        .max(200, 'Too many variants')
        .refine(
            (variants) => {
                const combos = variants.map((v) => {
                    const size = v.size.name.trim().toLowerCase();

                    if (v.color) {
                        const color = v.color.name.trim().toLowerCase();
                        return `${size}-${color}`;
                    }

                    // kalau color tidak ada → pakai size saja
                    return size;
                });

                return new Set(combos).size === combos.length;
            },
            {
                message:
                    'Duplicate variant combination is not allowed (same size or same size & color)',
            },
        ),

    images: z.array(ImageSchema).max(20, 'Too many images').optional(),

    category_id: z.string().min(1, 'Product category is required'),

    discount: z
        .object({
            type: z.string().optional(),
            value: z.number().optional(),
            start_at: z.string().optional(),
            end_at: z.string().optional(),
            is_active: z.boolean().optional(),
        })
        .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
