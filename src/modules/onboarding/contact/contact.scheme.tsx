
import { z } from "zod";

export const businessContactScheme = z.object({
    country: z.string().min(1, 'Business country is required'),
    governorate: z.string().min(1, 'Business governorate is required'),
    addressLine1: z.string().min(1, 'Business address is required'),
    addressLine2: z.string().optional(),
    businessPhone: z
        .string()
        .min(11, 'Mobile number must be exactly 11 digits')
        .max(11, 'Mobile number must be exactly 11 digits')
        .refine((val) => /^(011|015|010|012)/.test(val), {
            message: 'Mobile number must start with 011, 015, 010, or 012',
        }),
    businessEmail: z.string().email('Email isn’t valid, valid email example: jw@example.com'),
    hotlineNumber: z
        .string()
        .optional()
        .refine((val) => !val || /^(011|015|010|012)/.test(val), {
            message: 'Mobile number must start with 011, 015, 010, or 012',
        })
        .refine((val) => !val || val.length === 11, {
            message: 'Mobile number must be exactly 11 digits',
        }),
})