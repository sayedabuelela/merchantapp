import { AxiosInstance } from "axios";
import { AccountStatistics, TransfersStatistics } from "./balance.model";

export const getTransfersStatistics = async (api: AxiosInstance): Promise<TransfersStatistics> => {
    console.log('getTransfersStatistics api', api.defaults.baseURL);
    try {
        const response = await api.get(`v2/transfers/overview/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching transfers statistics:", error);
        throw error;
    }
};

export const getAccountStatistics = async (api: AxiosInstance): Promise<AccountStatistics> => {
    console.log('getAccountStatistics api', api.defaults.baseURL);
    try {
        const response = await api.get(`v2/account/overview/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching account statistics:", error);
        throw error;
    }
};