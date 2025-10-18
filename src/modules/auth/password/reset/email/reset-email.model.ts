import { z } from "zod";
import { ResetEmailSchema } from "./reset-email.scheme";

export type ResetEmailFormData = z.infer<typeof ResetEmailSchema>;