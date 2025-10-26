import { AxiosInstance } from "axios";
import {
    GenerateOtpResponse,
    VerifyCodeRequest,
    VerifyCodeResponse
} from "./otp.model";
import { AuthResponse } from "../../auth.model";

// export const getOtp = async (
//     api: AxiosInstance,
//     key: string
// ): Promise<GenerateOtpResponse> => {
//     const request = await api.post(`/v2/identity/otp/generate?operation=signup`, { key });
//     return request.data;
// };

export const authenticateWith2fa = async (
    api: AxiosInstance,
    payload: { signupKey: string, code: string },
): Promise<AuthResponse> => {
    console.log('authenticateWith2fa payload : ', payload);
    const request = await api.post(`/v2/identity/authenticate?operation=2fa_verify`, payload);
    return request.data;
};