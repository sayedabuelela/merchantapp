import { z } from "zod";

const passwordCriteria = z
    .string()
    .min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/\d/, 'Must contain a number')
    .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
        'Must contain a special character'
    );

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(8, 'Must be at least 8 characters'),
    newPassword: passwordCriteria,
});