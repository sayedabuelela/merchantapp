import { LoginFormData, LoginRequest } from './login.model';
import { getDeviceInfo, getPushToken } from "@/src/modules/notifications/notification.service";
import { AxiosInstance } from "axios";
import { AuthResponse, User } from "../auth.model";

export const authenticate = async (api: AxiosInstance, credentials: LoginFormData): Promise<AuthResponse> => {
    // console.log("authenticate");
    const fcmToken = await getPushToken() as string;
    const { deviceId, huawei } = await getDeviceInfo();
    const loginRequest: LoginRequest = {
        ...credentials,
        fcmData: {
            deviceId,
            fcmToken,
            huawei
        }
    };

    const response = await api.post<AuthResponse>('/v2/identity/authenticate', loginRequest);
    // console.log("authenticate response", response.data);
    return response.data;
};

export const getMerchant = async (api: AxiosInstance): Promise<User> => {
    // console.log("getMerchant");
    const response = await api.get<User>('/v2/identity/user');
    // console.log("getMerchant response", response.data);
    return response.data;
};
