import { AxiosInstance } from "axios";
import { GenerateOtpResponse, VerifyCodeRequest, VerifyCodeResponse } from "./otp.model";

export const getResetOtp = async (api: AxiosInstance, email: string): Promise<GenerateOtpResponse> => {
    const request = await api.post(`/v2/identity/reset-password`, { email })
    return request.data;
}

export const verifyResetCode = async (api: AxiosInstance, { key, code }: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    const request = await api.post(`/v2/identity/otp/verify?operation=resetPassword`, { key, code })
    return request.data;
}

// /v2/identity/reset-password/verify-token/0253 ==> body : { password: string }