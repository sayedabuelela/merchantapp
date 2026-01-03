
import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const businessContactScheme = z.object({
    country: z.string().trim().min(1, 'Business country is required'),
    governorate: z.string().trim().min(1, 'Business governorate is required'),
    addressLine1: z.string().trim().min(1, 'This field is required'),
    addressLine2: z.string().trim().optional(),
    businessPhone: z
        .string()
        .trim()
        .min(1, 'This field is required')
        .min(11, 'Mobile number must be exactly 11 digits')
        .max(11, 'Mobile number must be exactly 11 digits')
        .refine((val) => /^(011|015|010|012)/.test(val), {
            message: 'Mobile number must start with 011, 015, 010, or 012',
        })
    ,

    businessEmail: z.string().trim().min(1, 'This field is required').regex(emailRegex, "Email isn't valid, valid email example: jw@example.com"),
    hotlineNumber: z
        .string()
        .trim()
        .optional()
    // .refine((val) => !val || /^(011|015|010|012)/.test(val), {
    //     message: 'Mobile number must start with 011, 015, 010, or 012',
    // })
    // .refine((val) => !val || val.length === 11, {
    //     message: 'Mobile number must be exactly 11 digits',
    // })
    ,
})