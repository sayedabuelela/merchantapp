import { AxiosInstance } from "axios";
import { ChangePasswordRequest, ChangePasswordResponse } from "./change.model";

// PUT
// https://api.staging.payformance.io/v2/identity/change-password

// currentPassword
// newPassword
// response :message

export const changePasswordService = async (api: AxiosInstance, { currentPassword, newPassword }: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const request = await api.put(`/v2/identity/change-password`, { currentPassword, newPassword });
    return request.data;
}