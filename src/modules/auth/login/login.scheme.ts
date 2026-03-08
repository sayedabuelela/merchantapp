import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
    email: z.string().min(1, 'This field is required').trim().regex(emailRegex, "Email isn't valid, valid email example: jw@example.com"),
    password: z.string().min(1, 'This field is required').trim(),
});

