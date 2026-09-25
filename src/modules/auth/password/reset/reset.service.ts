import { AxiosInstance } from "axios";
import { ResetPasswordRequest, ResetPasswordResponse } from "./reset.model";

export const resetService = async (api: AxiosInstance, { code, email, password }: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const request = await api.put(`/v2/identity/reset-password/verify-token/${code}`, { password, signupKey: email })
    return request.data;
}