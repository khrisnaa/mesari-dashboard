import { z } from 'zod';

const AttributeSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    hex: z.string().nullable().optional(),
    attribute_type_id: z.string(),
});

const ColorSchema = z.object({
    id: z.string().optional(),
    name: z.string().trim().min(1, 'Color name is required'),
    hex: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        message: 'Invalid HEX color (example: #FF5733)',
    }),
    isCustom: z.boolean().optional(),
});

const VariantSchema = z.object({
    size: AttributeSchema,
    color: ColorSchema,

    price: z.number().min(0, 'Price must be 0 or greater'),

    stock: z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative'),
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

    variants: z
        .array(VariantSchema)
        .min(1, 'At least one variant is required')
        .max(200, 'Too many variants')
        .refine(
            (variants) => {
                const combos = variants.map((v) => {
                    const color = v.color.name.trim().toLowerCase();
                    const size = v.size.name.trim().toLowerCase();

                    return `${color}-${size}`;
                });

                return new Set(combos).size === combos.length;
            },
            {
                message:
                    'Duplicate variant combination (same color & size) is not allowed',
            },
        ),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
