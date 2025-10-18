import { z } from "zod";
import { RegisterEmailSchema } from "./register-email.scheme";

export type RegisterEmailFormData = z.infer<typeof RegisterEmailSchema>;