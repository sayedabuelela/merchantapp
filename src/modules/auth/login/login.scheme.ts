import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('Email isn’t valid, valid email example: jw@example.com'),
    password: z.string().min(1, 'This field is required'),
});

