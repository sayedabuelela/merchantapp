import { z } from "zod";

export const RegisterDataSchema = z.object({
    mobileNumber: z
        .string()
        .min(11, 'Mobile number must be exactly 11 digits')
        .max(11, 'Mobile number must be exactly 11 digits')
        .refine((val) => /^(011|015|010|012)/.test(val), {
            message: 'Mobile number must start with 011, 015, 010, or 012',
        }).trim(),
    storeName: z.string().min(1, 'This field is required.').trim(),
    firstName: z.string().min(1, 'This field is required.').trim(),
    lastName: z.string().min(1, 'This field is required.').trim(),
});


