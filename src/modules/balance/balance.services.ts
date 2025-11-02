import { AxiosInstance } from "axios";
import { AccountStatistics, TransfersStatistics, AccountsListResponse, AccountsListParams, ActivitiesResponse, FetchActivitiesParams } from "./balance.model";

export const getTransfersStatistics = async (api: AxiosInstance, accountId: string = 'all'): Promise<TransfersStatistics> => {
    console.log('getTransfersStatistics api', api.defaults.baseURL);
    try {
        const response = await api.get(`v2/transfers/overview/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching transfers statistics:", error);
        throw error;
    }
};

export const getAccountStatistics = async (api: AxiosInstance, accountId: string = 'all'): Promise<AccountStatistics> => {
    console.log('getAccountStatistics api', api.defaults.baseURL);
    try {
        const response = await api.get(`v2/account/overview/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching account statistics:", error);
        throw error;
    }
};

export const getAccountsList = async (
    api: AxiosInstance,
    params: AccountsListParams = {}
): Promise<AccountsListResponse> => {
    const { limit = 20, sortBy = '', sortType = -1, page = 1 } = params;
    console.log('getAccountsList api', api.defaults.baseURL);
    try {
        const response = await api.get(`v2/account/overview/accounts-list`, {
            params: { limit, sortBy, sortType, page }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching accounts list:", error);
        throw error;
    }
};

export const getActivities = async (
    api: AxiosInstance,
    params: FetchActivitiesParams = {}
): Promise<ActivitiesResponse> => {
    const {
        accountId = 'all',
    } = params;

    console.log('getActivities api', api.defaults.baseURL);

    try {
        // Determine endpoint based on activity type
        // let endpoint = '';
        // if (activityType === 'payout') {
        //     endpoint = `v2/payouts/${accountId}`;
        // } else if (activityType === 'transfer') {
        //     endpoint = `v2/transfers/${accountId}`;
        // } else {
        //     endpoint = `v2/activities/${accountId}`; // All activities
        // }
        console.log('`v2/balance/records/${accountId}`, { params }', `v2/balance/records/${accountId}`, { params });

        const response = await api.get(`v2/balance/records/${accountId}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};