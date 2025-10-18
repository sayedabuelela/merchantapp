import { z } from "zod";

export const RegisterEmailSchema = z.object({
    email: z.string().email('Email isn’t valid, valid email example: jw@example.com'),
});

