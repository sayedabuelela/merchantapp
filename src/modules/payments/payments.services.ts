import { AxiosInstance } from 'axios';
import {
    FetchSessionsParams,
    FetchSessionsResponse,
    FetchTransactionsParams,
    FetchTransactionsResponse,
    FetchDiscountsResponse,
    FetchBranchesResponse,
    FetchOrderDetailResponse,
    FetchTransactionDetailResponse,
    VoidOrderRequest,
    VoidOrderResponse,
    RefundOrderRequest,
    RefundOrderResponse,
    CaptureOrderRequest,
    CaptureOrderResponse,
    ContactOtpRefundRequest,
    ContactOtpRefundResponse,
    ContactRefundWithOtpRequest,
    ContactRefundWithOtpResponse,
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
        q,
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
    if (q) queryParams.q = q;
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

/**
 * Void an order
 * Endpoint: PUT /v3/orders/{orderId}?api-version=2
 * @param api - Axios instance from useApi hook
 * @param request - Void request parameters
 * @returns Promise with void operation response
 */
export const voidOrder = async (
    api: AxiosInstance,
    request: VoidOrderRequest
): Promise<VoidOrderResponse> => {
    const { orderId } = request;

    const response = await api.put<VoidOrderResponse>(
        `/v3/orders/${orderId}?api-version=2`,
        {
            apiOperation: 'VOID',
        }
    );

    return response.data;
};

/**
 * Refund an order (full or partial)
 * Endpoint: PUT /v3/orders/{orderId}?api-version=2
 * @param api - Axios instance from useApi hook
 * @param request - Refund request parameters
 * @returns Promise with refund operation response
 */
export const refundOrder = async (
    api: AxiosInstance,
    request: RefundOrderRequest
): Promise<RefundOrderResponse> => {
    const {
        orderId,
        amount,
        currency,
        isPosRefund,
        merchantId,
        terminalId,
        cardDataToken,
    } = request;

    let payload: Record<string, any> = {
        apiOperation: 'REFUND',
    };

    // Regular refund payload
    if (!isPosRefund) {
        payload.transaction = {
            amount,
            currency,
        };
    }

    // POS refund requires special payload
    if (isPosRefund && merchantId && terminalId && cardDataToken) {
        payload = {
            apiOperation: 'REFUND',
            merchantId,
            interactionSource: 'POS',
            isPOSPortalRefund: true,
            posTerminal: {
                terminalId,
            },
            paymentMethod: {
                type: 'CARD',
                card: {
                    cardToken: cardDataToken,
                },
            },
            reason: 'Customer requested refund',
            transaction: {
                amount: amount * 100, // POS refunds need amount in cents
                currency,
            },
        };
    }

    const response = await api.put<RefundOrderResponse>(
        `/v3/orders/${orderId}?api-version=2`,
        payload
    );

    return response.data;
};

/**
 * Capture an authorized order
 * Endpoint: PUT /v3/orders/{orderId}?api-version=2
 * @param api - Axios instance from useApi hook
 * @param request - Capture request parameters
 * @returns Promise with capture operation response
 */
export const captureOrder = async (
    api: AxiosInstance,
    request: CaptureOrderRequest
): Promise<CaptureOrderResponse> => {
    const { orderId } = request;

    const response = await api.put<CaptureOrderResponse>(
        `/v3/orders/${orderId}?api-version=2`,
        {
            apiOperation: 'CAPTURE',
            autoVoid: false,
        }
    );

    return response.data;
};

// ============================================================================
// Contact BNPL OTP Refund Services
// ============================================================================

/**
 * Request OTP for Contact BNPL refund
 * Endpoint: PUT /v3/orders/{orderId}?api-version=2
 *
 * This is Step 1 of the Contact BNPL refund flow.
 * The OTP will be sent to the customer's registered mobile number.
 *
 * @param api - Axios instance from useApi hook
 * @param request - OTP request parameters
 * @returns Promise with OTP request response
 */
export const requestContactRefundOtp = async (
    api: AxiosInstance,
    request: ContactOtpRefundRequest
): Promise<ContactOtpRefundResponse> => {
    const { orderId } = request;

    const response = await api.put<ContactOtpRefundResponse>(
        `/v3/orders/${orderId}?api-version=2`,
        {
            apiOperation: 'OTP_REFUND',
        }
    );

    return response.data;
};

/**
 * Submit Contact BNPL refund with OTP
 * Endpoint: PUT /v3/orders/{orderId}?api-version=2
 *
 * This is Step 2 of the Contact BNPL refund flow.
 * Requires the OTP received by the customer in Step 1.
 *
 * For full refund: omit the amount field
 * For partial refund: include the amount field
 *
 * @param api - Axios instance from useApi hook
 * @param request - Refund request parameters with OTP
 * @returns Promise with refund operation response
 */
export const refundContactWithOtp = async (
    api: AxiosInstance,
    request: ContactRefundWithOtpRequest
): Promise<ContactRefundWithOtpResponse> => {
    const { orderId, otp, amount } = request;

    // Build payload
    const payload: Record<string, any> = {
        apiOperation: 'REFUND',
        paymentMethod: {
            type: 'CONTACT',
            contact: {
                otp,
            },
        },
    };

    // Add transaction amount only for partial refunds
    if (amount !== undefined && amount > 0) {
        payload.transaction = {
            amount,
        };
    }

    const response = await api.put<ContactRefundWithOtpResponse>(
        `/v3/orders/${orderId}?api-version=2`,
        payload
    );

    return response.data;
};
