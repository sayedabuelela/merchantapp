import { z } from "zod";

// Validation constants
export const VALIDATION_LIMITS = {
    // Text field max lengths
    CUSTOMER_NAME_MAX_LENGTH: 50,
    ITEM_NAME_MAX_LENGTH: 50,
    FEE_NAME_MAX_LENGTH: 50,

    // Numeric field max values
    MAX_AMOUNT: 1000000000, // 1 billion
    MAX_RATE: 100, // 100%
} as const;

export const itemSchema = z.object({
    description: z.string()
        .min(1, "Item name is required")
        .max(VALIDATION_LIMITS.ITEM_NAME_MAX_LENGTH, `Item name must be ${VALIDATION_LIMITS.ITEM_NAME_MAX_LENGTH} characters or less`),
    unitPrice: z.number()
        .gt(0, "Unit price must be greater than 0")
        .max(VALIDATION_LIMITS.MAX_AMOUNT, `Unit price must not exceed ${VALIDATION_LIMITS.MAX_AMOUNT.toLocaleString()}`),
    quantity: z.number()
        .min(1, "Quantity must be at least 1")
        .max(VALIDATION_LIMITS.MAX_AMOUNT, `Quantity must not exceed ${VALIDATION_LIMITS.MAX_AMOUNT.toLocaleString()}`),
    subTotal: z.number().min(0),
});

export const feeSchema = z
    .object({
        name: z.string()
            .min(1, "Fee name is required")
            .max(VALIDATION_LIMITS.FEE_NAME_MAX_LENGTH, `Fee name must be ${VALIDATION_LIMITS.FEE_NAME_MAX_LENGTH} characters or less`),
        flatFee: z.number()
            .min(0, "Flat fee must be 0 or greater")
            .max(VALIDATION_LIMITS.MAX_AMOUNT, `Flat fee must not exceed ${VALIDATION_LIMITS.MAX_AMOUNT.toLocaleString()}`)
            .default(0),
        rate: z.number()
            .min(0, "Rate must be 0 or greater")
            .max(VALIDATION_LIMITS.MAX_RATE, `Rate must not exceed ${VALIDATION_LIMITS.MAX_RATE}%`)
            .default(0),
    })
    .refine(
        (fee) => fee.flatFee > 0 || fee.rate > 0,
        {
            message: "At least one fee value must be greater than 0",
            path: ["flatFee"],
        }
    );

const baseSchema = z.object({
    customer: z.object({
        name: z.string()
            .min(1, "Customer name is required")
            .max(VALIDATION_LIMITS.CUSTOMER_NAME_MAX_LENGTH, `Customer name must be ${VALIDATION_LIMITS.CUSTOMER_NAME_MAX_LENGTH} characters or less`),
    }),
    currency: z.string().optional(),
    extraFees: z.array(feeSchema).optional(),
    dueDate: z.date().optional()
        .refine((date) => {
            if (!date) return true;
            return date > new Date();
        }, {
            message: "The selected date has been passed",
        })
        .refine((date) => {
            if (!date) return true;
            // If date is in the past, let the first refinement handle the error
            if (date <= new Date()) return true;

            const now = new Date();
            const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);
            return date > thirtyMinutesLater;
        }, {
            message: "Due date must be at least 30 minutes in the future",
        }),
    referenceId: z.string().optional(),
    description: z.string().optional(),
    isSuspendedPayment: z.boolean().optional(),
});

export const createPaymentLinkSchema = baseSchema
    .extend({
        paymentType: z.enum(["simple", "professional"]),
        totalAmount: z.string().optional(),
        items: z.array(itemSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.paymentType === "simple") {
            if (!data.totalAmount) {
                ctx.addIssue({
                    code: "custom",
                    path: ["totalAmount"],
                    message: "Amount is required for simple type",
                });
            } else {
                const amount = parseFloat(data.totalAmount);
                if (!isNaN(amount) && amount > VALIDATION_LIMITS.MAX_AMOUNT) {
                    ctx.addIssue({
                        code: "custom",
                        path: ["totalAmount"],
                        message: `Amount must not exceed ${VALIDATION_LIMITS.MAX_AMOUNT.toLocaleString()}`,
                    });
                }
            }
        }
        if (data.paymentType === "professional" && (!data.items || data.items.length === 0)) {
            ctx.addIssue({
                code: "custom",
                path: ["items"],
                message: "At least one item is required for professional type",
            });
        }
    });

export type ItemType = z.infer<typeof itemSchema>;
export type FeeType = z.infer<typeof feeSchema>;
export type CreatePaymentLinkTypes = z.infer<typeof createPaymentLinkSchema>;