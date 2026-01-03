import { z } from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ResetEmailSchema = z.object({
    email: z.string().min(1, 'This field is required').regex(emailRegex, "Email isn't valid, valid email example: jw@example.com").trim(),
});
