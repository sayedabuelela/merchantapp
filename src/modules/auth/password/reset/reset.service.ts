import { AxiosInstance } from "axios";
import { ResetPasswordRequest, ResetPasswordResponse } from "./reset.model";

export const resetService = async (api: AxiosInstance, { code, password }: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const request = await api.put(`/v2/identity/reset-password/verify-token/${code}`, { password })
    return request.data;
}