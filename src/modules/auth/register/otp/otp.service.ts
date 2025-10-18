import { AxiosInstance } from "axios";
import {
    GenerateOtpResponse,
    VerifyCodeRequest,
    VerifyCodeResponse
} from "./otp.model";

export const getOtp = async (
    api: AxiosInstance,
    key: string
): Promise<GenerateOtpResponse> => {
    const request = await api.post(`/v2/identity/otp/generate?operation=signup`, { key });
    return request.data;
};

export const verifyCode = async (
    api: AxiosInstance,
    payload: VerifyCodeRequest
): Promise<VerifyCodeResponse> => {
    const request = await api.post(`/v2/identity/otp/verify?operation=signup`, payload);
    return request.data;
};