/**
 * Raw instant-settlements v3 API DTOs (request + response shapes).
 *
 * Confirmed against `instant-settlements-v3.postman_collection.json` (FIN-20275 v3)
 * example bodies. Mounted at /v3/payment/instant-settlements.
 *
 * UI never consumes these directly — they pass through the mapper layer
 * (`mappers/instant-settlement.mappers.ts`) into presentation/domain models.
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export interface PaginationDTO {
    total: number;
    limit: number;
    page: number;
    pages: number;
}

/** Optional customer block on a transaction — renders only when returned. */
export interface CustomerDTO {
    name?: string;
    phone?: string;
    email?: string;
}

// ---------------------------------------------------------------------------
// Eligible transactions: GET /v3/payment/instant-settlements/instant/eligible-transactions
// ---------------------------------------------------------------------------

export interface EligibleTransactionDTO {
    transactionId: string;
    orderId: string;
    /** settlement batch id */
    batchId?: string;
    operation: string;
    channel: string;
    method: string;
    /** gross amount */
    amount: number;
    sellingFees: number;
    vat: number;
    /** net amount */
    settlementAmount: number;
    transactionDate: string;
    rfsDate: string;
    accountId: string;
    /** optional — forward-compatible; render badge only if present */
    status?: string;
    /** optional — render the customer row only when present */
    customer?: CustomerDTO;
    /** FIN-20275 — false when an agent unselected the row; absent pre-release */
    selected?: boolean;
    /** FIN-20275 — ISO date when the row was unselected, else null */
    unselectedAt?: string | null;
}

/** Whole-set totals (NOT the current selection). */
export interface EligibleSummaryDTO {
    count: number;
    totalAmount: number;
    totalSettlementAmount: number;
}

/** Real daily/per-request limits (top-level `limits` on the eligible response). */
export interface LimitsDTO {
    perRequestCap: number;
    dailyCap: number;
    usedToday: number;
    remainingToday: number;
}

export interface EligibleListResponseDTO {
    message: string;
    data: EligibleTransactionDTO[];
    pagination: PaginationDTO;
    summary: EligibleSummaryDTO;
    limits: LimitsDTO;
}

// ---------------------------------------------------------------------------
// Inquiry: POST /v3/payment/instant-settlements/instant/inquiry
// ---------------------------------------------------------------------------

export interface InquiryRequestDTO {
    transactionIds: string[];
}

/** Bare object — NO `{ message, data }` envelope. `flatFees` is the flat line. */
export interface InquiryResponseDTO {
    totalAmount: number;
    totalSettlementAmount: number;
    totalRateFees: number;
    vat: number;
    flatFees: number;
    totalFees: number;
    netTransferAmount: number;
    transactionsCount: number;
    /** accounts the selected transactions settle into */
    accountIds?: string[];
}

// ---------------------------------------------------------------------------
// Create request: POST /v3/payment/instant-settlements/instant-requests (201)
// ---------------------------------------------------------------------------

export interface CreateRequestDTO {
    transactionIds: string[];
    /**
     * When true the whole request is rejected instead of the agent excluding
     * individual transactions from it (portal: "Reject Request if Any
     * Transaction Is Excluded").
     */
    declineTransactionOnPartialFailure: boolean;
}

export interface StatusHistoryEntryDTO {
    status: string;
    at: string;
}

/** Core request entity (merchant role-shaped: no `riskReview`). */
export interface RequestDTO {
    id: string;
    requestId: string;
    merchantId: string;
    merchantName: string;
    storeName: string;
    status: string;
    declineReason?: string | null;
    totalAmount: number;
    totalSettlementAmount: number;
    totalRateFees: number;
    flatFees: number;
    vat: number;
    totalFees: number;
    netTransferAmount: number;
    transactionsCount: number;
    requestedBy: string;
    createdAt: string;
    updatedAt: string;
    statusHistory: StatusHistoryEntryDTO[];
}

export interface CreateRequestResponseDTO {
    message: string;
    data: RequestDTO;
}

// ---------------------------------------------------------------------------
// Requests history: GET /v3/payment/instant-settlements/instant-requests
// ---------------------------------------------------------------------------

export interface RequestsListResponseDTO {
    message: string;
    data: RequestDTO[];
    pagination: PaginationDTO;
}

// ---------------------------------------------------------------------------
// Request details: GET /v3/payment/instant-settlements/instant-requests/{uuid}
// ---------------------------------------------------------------------------

/**
 * Nested fee-config limits (Codex #3) — a SEPARATE shape from the top-level
 * `LimitsDTO`: `feeConfigSnapshot.limits` only carries the caps (no usedToday/
 * remainingToday). Do NOT reuse `LimitsDTO` here.
 */
export interface FeeConfigLimitsDTO {
    perRequestCap: number;
    dailyCap: number;
}

export interface FeeConfigSnapshotDTO {
    rate: number;
    flat: number;
    limits: FeeConfigLimitsDTO;
}

export interface PayoutMethodDTO {
    payoutMethod: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankAbbreviation: string;
    bankBranchName: string;
    bankBranchCode: string;
}

/** Records list source (embedded in the details response). */
export interface LinkedBalanceRecordDTO {
    recordId: string;
    accountId: string;
    /** FIN-20275 — snapshot at deduction time; key always present, null if absent */
    accountName?: string | null;
    /** signed: positive = in, negative = out */
    amount: number;
    valueDate: string;
    /** has the record been reflected on the balance yet */
    isReflected: boolean;
    /** e.g. INSTANT_SETTLEMENT_DEDUCTION */
    type: string;
    operation: string;
    origin: string;
}

export interface RequestDetailsDTO extends RequestDTO {
    /** OPTIONAL — absent in the "linked records unavailable" example */
    feeConfigSnapshot?: FeeConfigSnapshotDTO;
    /** OPTIONAL — keyed by accountId; absent in the unavailable example */
    payoutMethodsByAccount?: Record<string, PayoutMethodDTO>;
    /** embedded Records list; null when unavailable */
    linkedBalanceRecords: LinkedBalanceRecordDTO[] | null;
    linkedBalanceRecordsUnavailable?: boolean;
    /** top-level daily/per-request limits (same shape as the eligible response) */
    limits?: LimitsDTO;
    /** FIN-20275 — rows an agent removed from the request; [] when none */
    unselectedTransactions?: EligibleTransactionDTO[];
    unselectedCount?: number;
    unselectedSettlementAmount?: number;
}

/**
 * Envelope wrapper for GET /{uuid} (Codex #1). The SERVICE unwraps
 * `response.data.data`; `mapRequestDetails` receives a plain `RequestDetailsDTO`.
 */
export interface RequestDetailsResponseDTO {
    message: string;
    data: RequestDetailsDTO;
}

// ---------------------------------------------------------------------------
// Member transactions: GET /v3/payment/instant-settlements/instant-requests/{uuid}/transactions
// Same shape as eligible transactions + pagination.
// ---------------------------------------------------------------------------

export interface MemberTransactionsResponseDTO {
    message: string;
    data: EligibleTransactionDTO[];
    pagination: PaginationDTO;
}

// ---------------------------------------------------------------------------
// Custom-amount suggestions: POST /v3/payment/instant-settlements/instant/suggestions
// Returns the combinations nearest BELOW and ABOVE the target, clamped to caps.
// ---------------------------------------------------------------------------

export interface SuggestionsRequestDTO {
    /** required, > 0 */
    targetAmount: number;
    channel?: string;
    method?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface SuggestionGroupDTO {
    /** total amount of this suggested transaction set */
    totalAmount: number;
    transactionsCount: number;
    /** backend-approved transaction set this suggestion would settle */
    transactionIds: string[];
}

/** Caps-only limits block on the suggestions response. */
export interface SuggestionsLimitsDTO {
    perRequestCap: number;
    dailyCap: number;
    remainingToday: number;
}

export interface SuggestionsDTO {
    targetAmount: number;
    /** nearest combination below the target (omitted when none) */
    below?: SuggestionGroupDTO;
    /** nearest combination above the target (omitted when none) */
    above?: SuggestionGroupDTO;
    candidatesConsidered?: number;
    truncated?: boolean;
    approximate?: boolean;
    limits?: SuggestionsLimitsDTO;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export interface PerRequestLimitErrorData {
    code: 'INSTANT_SETTLEMENT_PER_REQUEST_LIMIT_EXCEEDED';
    limit: number;
    requested: number;
}

export interface DailyLimitErrorData {
    code: 'INSTANT_SETTLEMENT_DAILY_LIMIT_EXCEEDED';
    limit: number;
    usedToday: number;
    remaining: number;
}

export type LimitErrorData = PerRequestLimitErrorData | DailyLimitErrorData;

/** Backend error body (the interceptor rejects with this raw object). */
export interface ApiErrorDTO {
    error?: { cause?: string };
    messages?: { en?: string; ar?: string };
    status?: 'FAILURE' | string;
    /** present on 422 limit errors; absent on 409 transition conflicts */
    data?: LimitErrorData;
}

// ---------------------------------------------------------------------------
// Query params (per collection — there is NO generic free-text `search` param)
// ---------------------------------------------------------------------------

export type RequestStatusEnum =
    | 'PENDING'
    | 'PROCESSING'
    | 'TRANSFERRED'
    | 'DECLINED';

export interface EligibleQueryParams {
    page?: number;
    limit?: number;
    channel?: string;
    method?: string;
    dateFrom?: string;
    dateTo?: string;
    /** ISR-… lookup (human requestId), search filter only */
    requestId?: string;
}

export interface RequestsQueryParams {
    page?: number;
    limit?: number;
    status?: RequestStatusEnum;
    dateFrom?: string;
    dateTo?: string;
    requestId?: string;
}

export interface MemberTransactionsQueryParams {
    page?: number;
    limit?: number;
    /** FIN-20275 — server default ALL */
    selection?: 'ALL' | 'SELECTED' | 'UNSELECTED';
}
