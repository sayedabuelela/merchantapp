import { AxiosInstance } from "axios";
import { getOrCreateDeviceId } from "@/src/core/utils/deviceId";

export const logoutDevice = async (api: AxiosInstance): Promise<void> => {
    const deviceId = await getOrCreateDeviceId();
    await api.post('/v2/identity/logout', { deviceId });
};
