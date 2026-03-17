import {
    TransactionPagination,
    SortType,
    SourceOfFunds,
    TransactionResponseMessage,
    PCCOperations,
} from '../payments/payments.model';

// Branch info returned in settlement transactions
export interface SettlementBranch {
    id: string;
    branchId: string;
    name: string;
    address: string;
}

// POS Terminal info for settlement transactions
export interface SettlementPosTerminal {
    traceNumber: string;
    referenceNumber: string;
    terminalId: string;
    serialNo: string;
    entryMode: string;
    NII: string;
    merchantActivity: string;
    cardAcceptor: string;
    location: string;
    versions: string;
    acquiringInstitutionIdentificationCode: string;
    posConditionCode: string;
    settlementType: string;
    primaryBank: string;
    primaryBankMerchantId: string;
    primaryBankTerminalId: string;
    branch: SettlementBranch;
}

// POS Transaction Details
export interface PosTransactionDetails {
    referenceNumber: string;
    traceNumber: string;
    cvm: string;
}

// Settlement Transaction - matches GET /v2/aggregator/settlement-transactions response
export interface SettlementTransaction {
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
    paymentAgreement: string;
    provider: string;
    status: string;
    transactionId: string;
    id: string;
    channel: string;
    type: string;
    currency: string;
    lastStatus: string;
    amount: number;
    branch?: SettlementBranch;
    isVoided: boolean;
    isCancelled: boolean;
    dateToFilter: string;
    date: string;
    responseDate: string;
    batchId?: string;
    ackStatus?: string;
    posTerminal?: SettlementPosTerminal;
    posTransactionDetails?: PosTransactionDetails;
    formattedDate: string;
    dateTime: string;
    lastModifiedDate: string;
    issuer: string;
    issuerAuthorizationCode: string;
    transactionResponseCode: string;
    transactionResponseMessage: TransactionResponseMessage;
    pcc: PCCOperations;
    transactions: any[];
    __v: number;
    isSettled: boolean;
    settlementDate?: string;
    pccFees: {
        early_settlement_fees: {
            PCC_early_settlement_rate: number,
            total_early_settlement_rate: number,
            total_early_settlement_fees: number
        },
        early_settlement_vat: number,
        settledAmount: number
    },
}

// Fetch settlement transactions params
export interface FetchSettlementTransactionsParams {
    sortBy?: string;
    sortType?: SortType;
    limit?: number;
    page?: number;
    search?: string;
    branchIds?: string;
}

// Fetch settlement transactions response (same shape as transactions API)
export interface FetchSettlementTransactionsResponse {
    body: SettlementTransaction[];
    pagination: TransactionPagination;
    summary: {
        totalAmount: number;
        orderCount: number;
    }
    message: string;
}

// Instant Settlement Inquiry
export interface InstantSettlementInquiryRequest {
    transactionIds: string[];
}

export interface InstantSettlementInquiryResponse {
    totalAmount: number;
    totalSettledAmount: number;
    flatFees: number;
    rateFees: number;
    vat: number;
    totalRateFees: number;
    totalFees: number;
    requestedAmount: number;
    numberOfTransactions: number;
    merchantId: string;
    transactionIds: string[];
    requestedBy: string;
    notificationSent: boolean;
}

export interface InstantSettlementInquiryApiResponse {
    status: string;
    messages: { en: string; ar: string };
    response: InstantSettlementInquiryResponse;
}

// Instant Settlement Request
export interface InstantSettlementRequestPayload {
    transactionIds: string[];
}

export interface InstantSettlementRequestResponse {
    requestDate: string;
    amount: number;
    count: number;
    fees: number;
    status: string;
}
