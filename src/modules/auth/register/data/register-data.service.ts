import { getDeviceInfo, getPushToken } from "@/src/modules/notifications/notification.service";
import { AxiosInstance } from "axios";
import { RegisterData } from "./register-data.model";
import { FCMData } from "@/src/modules/auth/auth.model";

export const signup = async (api: AxiosInstance, credentials: RegisterData) => {
    const fcmToken = await getPushToken() as string;
    const { deviceId, huawei } = await getDeviceInfo();
    // console.log("credentials : ", credentials);

    const registerRequest: RegisterData & { fcmData: FCMData } = {
        ...credentials,
        countryCode: "+20",
        fcmData: {
            deviceId,
            fcmToken,
            huawei
        }
    };

    const request = await api.post(`/v2/identity/register?operation=signup`, registerRequest)
    return request.data;
}