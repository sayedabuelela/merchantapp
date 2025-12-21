import { getDeviceInfo, getPushToken } from "@/src/modules/notifications/notification.service";
import { AxiosInstance } from "axios";
import { AuthResponse, FCMData, GetMerchantResponse } from "../auth.model";
import { LoginFormData, LoginRequest } from './login.model';

export const authenticate = async (api: AxiosInstance, credentials: LoginFormData & { biometricEnabled?: boolean }): Promise<AuthResponse> => {
    const fcmToken = await getPushToken() as string;
    const { deviceId, huawei } = await getDeviceInfo();
    const fcmData: FCMData = {
        deviceId,
        fcmToken,
        huawei,
    };
    const loginRequest: LoginRequest = {
        ...credentials,
    };
    if (fcmToken) {
        loginRequest.fcmData = fcmData;
    }


    const response = await api.post<AuthResponse>('/v2/identity/authenticate', loginRequest);
    console.log("authenticate response", response.data);
    return response.data;
};

export const getMerchant = async (api: AxiosInstance): Promise<GetMerchantResponse> => {
    const response = await api.get<GetMerchantResponse>('/v2/identity/user');
    console.log("getMerchant response", response.data);
    return response.data;
};
