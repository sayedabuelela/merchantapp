import { Transaction, TransactionPagination, SortType } from '../payments/payments.model';

// Settlement Transaction extends Transaction with settled amount
export interface SettlementTransaction extends Transaction {
    settledAmount: number;
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
    message: string;
}

// Instant Settlement Inquiry
export interface InstantSettlementInquiryRequest {
    transactionIds: string[];
}

export interface InstantSettlementInquiryResponse {
    totalAmount: number;
    totalSettledAmount: number;
    instantSettlementFees: number;
    achFees: number;
    vat: number;
    payoutAmount: number;
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
