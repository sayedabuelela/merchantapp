import { z } from "zod";
import { RegisterDataSchema } from "./register-data.scheme";


export type RegisterDataFormData = z.infer<typeof RegisterDataSchema>;

export interface RegisterDataFormProps {
    onSubmit: (data: RegisterDataFormData) => void;
    loading: boolean;
    error?: string;
}

export type RegisterData = RegisterDataFormData & {
    signupKey: string;
    password: string;
    code: string;
}

export type RegisterDataError = {
    error?: string;
    success: boolean;
    message?: string;
};

