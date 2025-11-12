// Session Status Types
export type SessionStatus = 'OPENED' | 'PAID' | 'EXPIRED' | 'FAILED' | 'REFUNDED'| 'VOIDED';

// Payment Method Types
export type PaymentMethod = 'cash' | 'card' | 'wallet' | string;

// Channel Types
export type Channel = 'all' | 'ECOMMERCE' | 'POS' | string;

// Sort Type
export type SortType = 1 | -1; // 1 for ascending, -1 for descending

// Payment Session Interfaces
export interface PaymentParams {
    amount: number;
    currency: string;
    order: string;
    storeName: string;
    interactionSource?: string;
}

export interface PaymentSession {
    _id: string;
    merchantId: string;
    status: SessionStatus;
    capturedAmount: number;
    refundedAmount: number;
    paymentParams: PaymentParams;
    createdAt: string;
    updatedAt: string;
    acquirer?: string | null;
    method?: string;
    orderId?: string;
    provider?: string;
    targetTransactionId?: string;
}

export interface Pagination {
    total: number;
    limit: number;
    page: number;
    pages: number;
}

export interface OrderStats {
    paidOrders: {
        count: number;
        amount: number;
    };
    unpaidOrders: {
        count: number;
        amount: number;
    };
}

export interface FetchSessionsResponse {
    message: string;
    data: PaymentSession[];
    pagination: Pagination;
    stats: OrderStats;
}

export interface FetchSessionsParams {
    limit?: number;
    page?: number;
    dateFrom?: string; // ISO date string (YYYY-MM-DD)
    dateTo?: string; // ISO date string (YYYY-MM-DD)
    sortType?: SortType;
    channel?: Channel;
    search?: string;
    filterStatus?: boolean;
    status?: SessionStatus;
    method?: string;
    origin?: string;
    branchName?: string;
}

// Transaction Interfaces
export type TransactionStatus = 'Approved' | 'Declined' | 'Pending' | 'Voided' | 'Cancelled' | string;
export type TransactionType = 'PAYMENT' | 'REFUND' | 'REVERSAL' | string;
export type TransactionLastStatus = 'CAPTURED' | 'AUTHORIZED' | 'REFUNDED' | 'VOIDED' | string;
export type PaymentAgreement = 'regular' | 'recurring' | string;

export interface SourceOfFunds {
    type: string;
}

export interface TransactionResponseMessage {
    en: string;
    ar: string;
}

export interface PCCOperations {
    operations: any[];
}

export interface Transaction {
    _id: string;
    isManualRefund: boolean;
    isPOSPortalRefund: boolean;
    labels: string[];
    createdAt: string;
    merchantId: string;
    storeName: string;
    orderReference: string;
    merchantOrderId: string;
    totalCapturedAmount: number;
    totalRefundedAmount: number;
    totalAuthorizedAmount: string;
    method: string;
    sourceOfFunds: SourceOfFunds;
    paymentType: string;
    paymentAgreement: PaymentAgreement;
    provider: string;
    status: TransactionStatus;
    transactionId: string;
    id: string;
    channel: string;
    type: TransactionType;
    currency: string;
    lastStatus: TransactionLastStatus;
    amount: number;
    isVoided: boolean;
    isCancelled: boolean;
    dateToFilter: string;
    date: string;
    responseDate: string;
    formattedDate: string;
    dateTime: string;
    lastModifiedDate: string;
    issuer: string;
    issuerAuthorizationCode: string | null;
    transactionResponseCode: string;
    transactionResponseMessage: TransactionResponseMessage;
    pcc: PCCOperations;
    transactions: any[];
    __v: number;
}

export interface TransactionPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
    lastPage: number;
}

export interface FetchTransactionsResponse {
    body: Transaction[];
    pagination: TransactionPagination;
    message: string;
}

export interface FetchTransactionsParams {
    currency?: string;
    sortBy?: string;
    sortType?: SortType;
    limit?: number;
    status?: string;
    page?: number;
    startDate?: string; // ISO date string with time
    endDate?: string; // ISO date string with time
    search?: string;
    amountFrom?: number;
    amountTo?: number;
    channel?: string;
    type?: string;
    method?: string;
    paymentType?: string;
    discount?: string;
    posBranch?: string;
    labels?: string;
}

// Discount API
export interface FetchDiscountsResponse {
    message: string;
    data: string[];
}

// Branches API
export interface Branch {
    _id: string;
}

export interface FetchBranchesResponse {
    message: string;
    data: Branch[];
    pagination: Pagination;
}
