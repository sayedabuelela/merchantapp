import { AxiosInstance } from "axios";
import { BusinessDetailsRequestData, BusinessIndustries } from "./business.model";

export const getBusinessIndustries = async (api: AxiosInstance): Promise<BusinessIndustries> => {
    const response = await api.get('/v2/constants/industries');
    return response.data;
}

export const saveBusinessDetails = async (api: AxiosInstance, merchantId: string, data: BusinessDetailsRequestData): Promise<void> => {
    const response = await api.post(`/v2/merchants/${merchantId}/onborad`, data);
    return response.data;
}