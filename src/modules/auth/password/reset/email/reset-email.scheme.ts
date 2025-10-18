import { z } from "zod";

export const ResetEmailSchema = z.object({
    email: z.string().email('Email isn’t valid, valid email example: jw@example.com'),
});
