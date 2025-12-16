// Session Status Types
export type SessionStatus = 'OPENED' | 'PAID' | 'EXPIRED' | 'FAILED' | 'REFUNDED'| 'VOIDED';

// Payment Method Types
export type PaymentMethod = 'cash' | 'card' | 'wallet' | string;

// Channel Types
export type Channel = 'all' | 'ECOMMERCE' | 'POS' | string;

// Sort Type
export type SortType = 1 | -1; // 1 for ascending, -1 for descending

// Order Details Tab Type
export type OrderDetailsTabType = 'details' | 'settlement' | 'history';

// Transaction Details Tab Type
export type TransactionDetailsTabType = 'details' | 'settlement' | 'history';

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

// Shared interfaces between Order and Transaction

// VALU Payment Info
export interface ValuPayerInfo {
    mobileNumber?: string;
    productPrice?: string;
    customerName?: string | null;
    nationalID?: string | null;
    address?: string | null;
    firstEmiDueDate?: string;
    lastInstallmentDate?: string;
    loanNumber?: string;
    emi?: number;
    valuTransactionId?: string;
    tenure?: number;
    downPayment?: string | null;
    CashbackAmount?: string | null;
    ToUAmount?: string | null;
    financedAmount?: number;
    adminFees?: string | null;
}

// Source of Funds - supports multiple payment types
export interface SourceOfFunds {
    // Card Payment fields
    maskedCard?: string;
    extendedMaskedCard?: string;
    cardBrand?: string;
    cardHolderName?: string;
    cardDataToken?: string;
    ccvToken?: string;
    expiryYear?: string;
    expiryMonth?: string;
    storedOnFile?: string;
    save?: boolean;
    issuer?: string;
    agreement?: string | null;

    // VALU Payment fields
    payerInfo?: ValuPayerInfo;

    // Wallet Payment fields
    payerAccount?: string;
    networkReference?: string | null;
    payScheme?: string;
    paidThrough?: string;
    walletStrategy?: string;

    // Type discriminator (VALU, Cash, etc.)
    type?: string;
}

export interface TransactionResponseMessage {
    en: string;
    ar: string;
}

export interface SharedMetaData {
    kashierOriginType?: string;
    kashierOriginDetails?: {
        id?: string;
        name?: string;
        customerName?: string;
        customerEmail?: string;
        customerPhone?: string;
        createdUserId?: string;
    };
    'kashier payment UI version'?: string;
    'referral url'?: string;
    termsAndConditions?: {
        ip?: string;
    };
    merchantWebhook?: string;
    kashier_user?: {
        id?: string;
        fullName?: string;
        email?: string;
        selectedMID?: string;
    };
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

// Order Detail Interfaces
export interface OrderDetailPCC {
    rfs_due_after?: number;
    financial_institution?: string;
}

export interface OrderDetailPosTerminal {
    terminalId: string;
}

export interface OrderDetailHistoryItem {
    orderId?: string;
    method?: string;
    provider?: string;
    status: string;
    date: string;
    transactionId?: string;
    operation?: string;
    amount?: number;
    transactionResponseCode?: string;
    transactionResponseMessage?: TransactionResponseMessage;
    sourceOfFunds?: SourceOfFunds;
}

export interface OrderDetailPayment {
    sessionId: string;
    status: SessionStatus;
    createdAt: string;
    updatedAt: string;
    merchantId: string;
    merchantOrderId: string;
    amount: number;
    currency: string;
    method?: string;
    pcc: OrderDetailPCC;
    provider?: string;
    acquirer?: string | null;
    orderId: string;
    capturedAmount: number;
    refundedAmount: number;
    paymentChannel: string;
    rfsDate?: string;
    lastTransactionType?: string;
    origin?: string;
    issuerAuthorizationCode?: string;
    merchantType?: string;
    metaData?: SharedMetaData;
    fees?: string;
    earlySettlementFees?: number;
    vat?: string;
    settlementAmount?: string;
    sourceOfFunds?: SourceOfFunds;
    posTerminal?: OrderDetailPosTerminal;
    targetTransactionId?: string;
    history?: OrderDetailHistoryItem[];
}

export interface FetchOrderDetailResponse {
    message: string;
    data: OrderDetailPayment;
}

// Transaction Detail Interfaces
export interface TransactionDetailOrder {
    orderReference?: string;
    feeTrxAmount?: string;
    feeVatAmount?: string;
    accountType?: string;
    orderId?: string;
}

export interface TransactionDetailPCC {
    rfs_due_after?: number;
    financial_institution?: string;
}

export interface RelatedTransaction {
    labels: string[];
    status: string;
    amount: number;
    currency: string;
    operation: string;
    transactionId: string;
    date: string;
    rfsDate?: string;
}

export interface TransactionDetailOriginDetails {
    createdByUserId?: string;
}

export interface TransactionDetail {
    labels: string[];
    discount: string | null;
    transactionId: string;
    method: string;
    provider: string;
    pcc: TransactionDetailPCC;
    amount: number;
    currency: string;
    paymentChannel: string;
    status: string;
    paymentStatus: string;
    date: string;
    trxType: string;
    totalCapturedAmount: number;
    totalRefundedAmount: number;
    merchantOrderId: string;
    origin: string;
    metaData?: SharedMetaData;
    paymentOrigin?: string;
    transactionResponseCode: string;
    transactionResponseMessage: TransactionResponseMessage;
    rfsDate?: string;
    isReversed: boolean;
    isVoided: boolean;
    order?: TransactionDetailOrder;
    sourceOfFunds?: SourceOfFunds;
    transactions?: RelatedTransaction[];
    originDetails?: TransactionDetailOriginDetails;
}

export interface FetchTransactionDetailResponse {
    message: string;
    body: TransactionDetail;
}

// Void and Refund Operation Interfaces

/**
 * Request payload for voiding an order
 */
export interface VoidOrderRequest {
    orderId: string;
}

/**
 * Response structure for void operation
 */
export interface VoidOrderResponse {
    response: {
        apiOperation: string;
        operation: string;
        currency: string;
        result: string;
        status: string;
        authorizationNumber?: string;
        authentication?: any;
        paymentMethod?: any;
        metaData?: SharedMetaData;
        origin?: any;
        reconciliation?: any;
        merchantId: string;
        order: {
            amount: number;
            currency: string;
            originalAmount: number;
            callbackURL?: string;
            systemOrderId: string;
            reference: string;
        };
        amount: number;
        totalRefundedAmount: number;
        totalCapturedAmount: number;
        totalAuthorizedAmount: number;
        apiKeyId?: string;
        method: string;
        creationDate: string;
        orderId: string;
        provider: string;
        merchantOrderId: string;
        orderReference?: string;
        paymentType?: string;
        interactionSource?: string;
        device?: any;
        transactionId: string;
        transactionResponseCode: string;
        transactionResponseMessage: TransactionResponseMessage;
    };
    messages: TransactionResponseMessage;
    status: string;
    statusCode: number;
}

/**
 * Request payload for refunding an order
 */
export interface RefundOrderRequest {
    orderId: string;
    amount: number;
    currency: string;
    isPosRefund?: boolean;
    merchantId?: string;
    terminalId?: string;
    cardDataToken?: string;
}

/**
 * Response structure for refund operation
 */
export interface RefundOrderResponse {
    response: {
        apiOperation: string;
        operation: string;
        currency: string;
        result: string;
        status: string;
        authorizationNumber?: string;
        authentication?: any;
        paymentMethod?: any;
        metaData?: SharedMetaData;
        origin?: any;
        reconciliation?: any;
        merchantId: string;
        order: {
            amount: number;
            currency: string;
            originalAmount: number;
            callbackURL?: string;
            systemOrderId: string;
            reference: string;
        };
        amount: number;
        totalRefundedAmount: number;
        totalCapturedAmount: number;
        totalAuthorizedAmount: number;
        apiKeyId?: string;
        method: string;
        creationDate: string;
        orderId: string;
        provider: string;
        merchantOrderId: string;
        orderReference?: string;
        paymentType?: string;
        interactionSource?: string;
        device?: any;
        transactionId: string;
        transactionResponseCode: string;
        transactionResponseMessage: TransactionResponseMessage;
    };
    messages: TransactionResponseMessage;
    status: string;
    statusCode: number;
}

/**
 * Request payload for capturing an authorized order
 */
export interface CaptureOrderRequest {
    orderId: string;
}

/**
 * Response structure for capture operation
 */
export interface CaptureOrderResponse {
    response: {
        apiOperation: string;
        operation: string;
        currency: string;
        result: string;
        status: string;
        authorizationNumber?: string;
        authentication?: any;
        paymentMethod?: any;
        metaData?: SharedMetaData;
        origin?: any;
        reconciliation?: any;
        merchantId: string;
        order: {
            amount: number;
            currency: string;
            originalAmount: number;
            callbackURL?: string;
            systemOrderId: string;
            reference: string;
        };
        amount: number;
        totalRefundedAmount: number;
        totalCapturedAmount: number;
        totalAuthorizedAmount: number;
        apiKeyId?: string;
        method: string;
        creationDate: string;
        orderId: string;
        provider: string;
        merchantOrderId: string;
        orderReference?: string;
        paymentType?: string;
        interactionSource?: string;
        device?: any;
        transactionId: string;
        transactionResponseCode: string;
        transactionResponseMessage: TransactionResponseMessage;
    };
    messages: TransactionResponseMessage;
    status: string;
    statusCode: number;
}
