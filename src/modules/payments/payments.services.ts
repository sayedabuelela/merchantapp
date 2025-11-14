import { AxiosInstance } from 'axios';
import {
    FetchSessionsParams,
    FetchSessionsResponse,
    FetchTransactionsParams,
    FetchTransactionsResponse,
    FetchDiscountsResponse,
    FetchBranchesResponse,
    FetchOrderDetailResponse,
    FetchTransactionDetailResponse
} from './payments.model';

/**
 * Fetch payment sessions (orders) with filters
 * Endpoint: GET /v3/payment/sessions
 * @param api - Axios instance from useApi hook
 * @param params - Query parameters for filtering sessions
 * @returns Promise with sessions data, pagination, and stats
 */
export const fetchPaymentSessions = async (
    api: AxiosInstance,
    params: FetchSessionsParams = {}
): Promise<FetchSessionsResponse> => {
    const {
        limit = 20,
        page = 1,
        dateFrom,
        dateTo,
        sortType = -1,
        channel = 'all',
        search,
        filterStatus,
        status,
        method,
        origin,
        branchName,
    } = params;

    const queryParams: Record<string, any> = {
        limit,
        page,
        sortType,
        channel,
    };

    if (dateFrom) queryParams.dateFrom = dateFrom;
    if (dateTo) queryParams.dateTo = dateTo;
    if (search) queryParams.search = search;
    if (filterStatus !== undefined) queryParams.filterStatus = filterStatus;
    if (status) queryParams.status = status;
    if (method) queryParams.method = method;
    if (origin) queryParams.origin = origin;
    if (branchName) queryParams.branchName = branchName;

    const response = await api.get<FetchSessionsResponse>('/v3/payment/sessions', {
        params: queryParams,
    });

    return response.data;
};

/**
 * Fetch payment transactions with filters
 * Endpoint: GET /v2/aggregator/transactions
 * @param api - Axios instance from useApi hook
 * @param params - Query parameters for filtering transactions
 * @returns Promise with transactions data and pagination
 */
export const fetchTransactions = async (
    api: AxiosInstance,
    params: FetchTransactionsParams = {}
): Promise<FetchTransactionsResponse> => {
    const {
        currency,
        sortBy = '',
        sortType = -1,
        limit = 20,
        status = '',
        page = 1,
        startDate,
        endDate,
        search = '',
        amountFrom,
        amountTo,
        channel = '',
        type = '',
        method = '',
        paymentType = '',
        discount = '',
        posBranch = '',
        labels = '',
    } = params;

    const queryParams: Record<string, any> = {
        sortBy,
        sortType,
        limit,
        status,
        page,
        search,
        channel,
        type,
        method,
        paymentType,
        discount,
        posBranch,
        labels,
    };

    if (currency) queryParams.currency = currency;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;
    if (amountFrom !== undefined) queryParams.amountFrom = amountFrom;
    if (amountTo !== undefined) queryParams.amountTo = amountTo;

    const response = await api.get<FetchTransactionsResponse>('/v2/aggregator/transactions', {
        params: queryParams,
    });

    return response.data;
};

/**
 * Fetch available discounts
 * Endpoint: GET /v2/discounts
 * @param api - Axios instance from useApi hook
 * @returns Promise with list of discount names
 */
export const fetchDiscounts = async (
    api: AxiosInstance
): Promise<FetchDiscountsResponse> => {
    const response = await api.get<FetchDiscountsResponse>('/v2/discounts');
    return response.data;
};

/**
 * Fetch POS branches
 * Endpoint: GET /v3/payment/pos/branches
 * @param api - Axios instance from useApi hook
 * @returns Promise with list of branches
 */
export const fetchBranches = async (
    api: AxiosInstance
): Promise<FetchBranchesResponse> => {
    const response = await api.get<FetchBranchesResponse>('/v3/payment/pos/branches', {
        params: { limit: 100 } // Get all branches
    });
    return response.data;
};

/**
 * Fetch order (session) detail
 * Endpoint: GET /v3/payment/sessions/{sessionId}/payment
 * @param api - Axios instance from useApi hook
 * @param sessionId - The payment session _id
 * @returns Promise with order detail data
 */
export const fetchOrderDetail = async (
    api: AxiosInstance,
    sessionId: string
): Promise<FetchOrderDetailResponse> => {
    const response = await api.get<FetchOrderDetailResponse>(
        `/v3/payment/sessions/${sessionId}/payment`
    );
    return response.data;
};

/**
 * Fetch transaction detail
 * Endpoint: GET /v2/aggregator/transactions/{transactionId}
 * @param api - Axios instance from useApi hook
 * @param transactionId - The transaction ID
 * @returns Promise with transaction detail data
 */
export const fetchTransactionDetail = async (
    api: AxiosInstance,
    transactionId: string
): Promise<FetchTransactionDetailResponse> => {
    const response = await api.get<FetchTransactionDetailResponse>(
        `/v2/aggregator/transactions/${transactionId}`
    );
    return response.data;
};
