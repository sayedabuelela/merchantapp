import { AxiosInstance } from "axios";
import { AccountStatistics, TransfersStatistics, AccountsListResponse, AccountsListParams, ActivitiesResponse, FetchActivitiesParams, ActivityDetailsResponse, TransferDetailsResponse, PaymentDetailsResponse, SettlementWindowParams, DashboardStatisticsResponse } from "./balance.model";

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

export const getDashboardStatistics = async (
    api: AxiosInstance,
    params?: { startDate?: string; endDate?: string; currency?: string }
): Promise<DashboardStatisticsResponse> => {
    console.log('getDashboardStatistics api', api.defaults.baseURL);
    try {
        const queryParams: Record<string, string> = {};
        if (params?.startDate) queryParams.startDate = params.startDate;
        if (params?.endDate) queryParams.endDate = params.endDate;
        if (params?.currency) queryParams.currency = params.currency;

        const response = await api.get(`v2/aggregator/dashboard`, { params: queryParams });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
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
    try {
        const response = await api.get(`v2/balance/records/${accountId}`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        throw error;
    }
};

export const getActivityDetails = async (
    api: AxiosInstance,
    _id: string
): Promise<ActivityDetailsResponse> => {
    try {
        const response = await api.get(`v2/balance/record-details/${_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching activity details:", error);
        throw error;
    }
};

export const extractTransferReference = (originReference?: string) => {
    if (!originReference) return "";
    const match = originReference.match(/TRS-\d+/);
    return match ? match[0] : "";
};


export const getTransferDetails = async (
    api: AxiosInstance,
    originReference: string
): Promise<TransferDetailsResponse> => {
    try {
        const response = await api.get(`v2/transfers/${originReference}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching origin transfer details:", error);
        throw error;
    }
};

export const getPaymentDetails = async (
    api: AxiosInstance,
    originReference: string
): Promise<PaymentDetailsResponse> => {
    try {
        const response = await api.get(`v2/aggregator/transactions/${originReference}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching origin payment details:", error);
        throw error;
    }
};

export const getSettlementWindow = async (
    api: AxiosInstance,
    params: SettlementWindowParams
): Promise<ActivitiesResponse> => {
    const {
        accountId,
        limit = 3,
        sortType = -1,
        page = 1,
        dateFrom,
        dateTo
    } = params;

    try {
        const response = await api.get(`v2/balance/records/${accountId}`, {
            params: {
                limit,
                sortType,
                page,
                operation: 'settlement',
                origin: 'Settlement window',
                dateFrom,
                dateTo
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching settlement window:", error);
        throw error;
    }
};