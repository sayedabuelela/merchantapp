import { z } from "zod";

export const itemSchema = z.object({
    description: z.string().min(1),
    unitPrice: z.number().min(0),
    quantity: z.number().min(1),
    subTotal: z.number().min(0),
});

export const feeSchema = z
    .object({
        name: z.string().min(1, "Fee name is required"),
        flatFee: z.number().min(0).optional(),
        rate: z.number().min(0).optional(),
    })
    .refine(
        (fee) => typeof fee.flatFee === "number" || typeof fee.rate === "number",
        {
            message: "Either flat fee or rate is required",
            path: ["flatFee"],
        }
    );

const baseSchema = z.object({
    customer: z.object({
        name: z.string().min(1, "Customer name is required"),
    }),
    currency: z.string().optional(),
    extraFees: z.array(feeSchema).optional(),
    dueDate: z.date().optional(),
    referenceId: z.string().optional(),
    description: z.string().optional(),
});

export const createPaymentLinkSchema = baseSchema
    .extend({
        paymentType: z.enum(["simple", "professional"]),
        totalAmount: z.string().optional(),
        items: z.array(itemSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.paymentType === "simple" && !data.totalAmount) {
            ctx.addIssue({
                code: "custom", // ✅ correct in Zod v4
                path: ["totalAmount"],
                message: "Amount is required for simple type",
            });
        }
        if (data.paymentType === "professional" && (!data.items || data.items.length === 0)) {
            ctx.addIssue({
                code: "custom", // ✅ correct in Zod v4
                path: ["items"],
                message: "At least one item is required for professional type",
            });
        }
    });

export type ItemType = z.infer<typeof itemSchema>;
export type FeeType = z.infer<typeof feeSchema>;
export type CreatePaymentLinkTypes = z.infer<typeof createPaymentLinkSchema>;