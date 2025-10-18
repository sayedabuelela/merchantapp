import { AxiosInstance } from "axios";
import { BusinessContactRequestData, City } from "./contact.model";

export const getCountries = async (api: AxiosInstance): Promise<string[]> => {
    const response = await api.get('/v2/constants/countries');
    return response.data;
}

export const getCities = async (api: AxiosInstance): Promise<City[]> => {
    const response = await api.get('/v2/constants/cities');
    return response.data;
}

export const saveBusinessContact = async (api: AxiosInstance, merchantId: string, data: BusinessContactRequestData): Promise<void> => {
    const response = await api.post(`/v2/merchants/${merchantId}/onborad`, data);
    return response.data;
}
