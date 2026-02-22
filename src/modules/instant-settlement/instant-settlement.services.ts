import { AxiosInstance } from 'axios';
import {
    FetchSettlementTransactionsParams,
    FetchSettlementTransactionsResponse,
    InstantSettlementInquiryRequest,
    InstantSettlementInquiryResponse,
    InstantSettlementRequestPayload,
    InstantSettlementRequestResponse,
} from './instant-settlement.model';

/**
 * Fetch settleable transactions
 * Endpoint: GET /v2/aggregator/settlement-transactions
 */
export const fetchSettlementTransactions = async (
    api: AxiosInstance,
    params: FetchSettlementTransactionsParams = {}
): Promise<FetchSettlementTransactionsResponse> => {
    const {
        sortBy = '',
        sortType = -1,
        limit = 20,
        page = 1,
        search = '',
        branchIds = '',
    } = params;

    const queryParams: Record<string, any> = {
        sortBy,
        sortType,
        limit,
        page,
        search,
        branchIds,
    };

    const response = await api.get<FetchSettlementTransactionsResponse>(
        '/v2/aggregator/settlement-transactions',
        { params: queryParams }
    );

    return response.data;
};

/**
 * Inquire instant settlement fees for selected transactions
 * Endpoint: POST /v3/payment/instant-settlement/inquiry
 */
export const inquireInstantSettlement = async (
    api: AxiosInstance,
    request: InstantSettlementInquiryRequest
): Promise<InstantSettlementInquiryResponse> => {
    const response = await api.post<InstantSettlementInquiryResponse>(
        '/v3/payment/instant-settlement/inquiry',
        request
    );

    return response.data;
};

/**
 * Submit instant settlement request
 * Endpoint: POST /v3/payment/instant-settlement/request
 */
export const requestInstantSettlement = async (
    api: AxiosInstance,
    request: InstantSettlementRequestPayload
): Promise<InstantSettlementRequestResponse> => {
    const response = await api.post<InstantSettlementRequestResponse>(
        '/v3/payment/instant-settlement/request',
        request
    );

    return response.data;
};
