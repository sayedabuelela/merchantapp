import { loginSchema } from "@/src/modules/auth/login/login.scheme";
import { z } from "zod";
import { FCMData } from "../auth.model";

export type LoginFormData = z.infer<typeof loginSchema>;


export interface LoginRequest {
    email: string;
    password: string;
    fcmData: FCMData;
    biometricEnabled?: boolean;
}

export type LoginError = {
    error?: string;
    success: boolean;
    message?: string;
};




