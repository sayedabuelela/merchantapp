/**
 * Presentation / domain models (UI-facing).
 *
 * The UI consumes ONLY these — never raw DTOs or legacy v2 `payments.model`
 * shapes. Non-null where the UI requires it; mappers coalesce nullable API
 * fields to safe fallbacks at the boundary.
 */

/**
 * Status is carried as the RAW backend enum string (e.g. 'PROCESSING') and
 * rendered everywhere via the shared `StatusBox(rawStatus)` — no relabel, no
 * DisplayStatus bridge (§8 / Codex #2). Mappers normalize to upper-case.
 */
export type RequestStatus = string;

export interface Customer {
    name?: string;
    phone?: string;
    email?: string;
}

export interface EligibleTransaction {
    id: string;
    orderId: string;
    operation: string;
    channel: string;
    method: string;
    /** gross */
    amount: number;
    sellingFees: number;
    vat: number;
    /** net */
    settlementAmount: number;
    accountId: string;
    transactionDate: string;
    rfsDate: string;
    createdAt: string;
    /** optional raw-enum badge — present only if the API returns `status` */
    status?: RequestStatus;
    /** optional — render the customer row only when present */
    customer?: Customer;
}

/** Whole-set eligible totals (top summary card). Distinct from SelectedSummary. */
export interface EligibleSummary {
    count: number;
    totalAmount: number;
    totalSettlementAmount: number;
}

export interface Limits {
    perRequestCap: number;
    dailyCap: number;
    usedToday: number;
    remainingToday: number;
}

/** Derived from the current selection — drives payout enablement + confirm sheet. */
export interface SelectedSummary {
    amount: number;
    orderCount: number;
}

/** Fee breakdown from the inquiry response (8 fields). */
export interface InquiryBreakdown {
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

/** Requests history list item. */
export interface InstantRequestSummary {
    id: string;
    requestId: string;
    amount: number;
    netTransferAmount: number;
    ordersCount: number;
    /** raw backend enum — rendered via StatusBox */
    status: RequestStatus;
    createdAt: string;
}

export interface RecipientInfo {
    accountId: string;
    payoutMethod: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankAbbreviation: string;
    bankBranchName: string;
    bankBranchCode: string;
}

export interface FeeSnapshot {
    rate: number;
    flat: number;
}

/** A single status-transition entry (History tab). */
export interface RequestStatusHistoryEntry {
    /** raw backend enum — rendered via StatusBox */
    status: RequestStatus;
    at: string;
}

/**
 * Full request details — feeds 3 of the 4 tabs:
 *  - Details: header + Financial Summary + Payout method (`payoutMethods`)
 *  - Accounts: `records` (from embedded `linkedBalanceRecords`)
 *  - History: `statusHistory`
 * (Transactions tab is fed by a separate paginated query.)
 */
export interface InstantRequestDetails {
    id: string;
    requestId: string;
    merchantName: string;
    storeName: string;
    /** raw backend enum — rendered via StatusBox */
    status: RequestStatus;
    declineReason?: string;
    // money
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
    /** empty when payoutMethodsByAccount missing — hide Payout-method block */
    payoutMethods: RecipientInfo[];
    /** absent when feeConfigSnapshot missing — hide fee-snapshot % rows */
    feeSnapshot?: FeeSnapshot;
    /** Accounts tab — from embedded `linkedBalanceRecords` (no pagination) */
    records: RequestRecord[];
    /** true when `linkedBalanceRecordsUnavailable` — show unavailable state */
    recordsUnavailable: boolean;
    /** History tab — coalesced to [] when absent */
    statusHistory: RequestStatusHistoryEntry[];
}

/**
 * A row in the embedded Records list (Accounts tab). Renders `accountId` only
 * (no friendly source/destination labels — SSOT §6); direction from the signed
 * amount, magnitude in `amount`.
 */
export interface RequestRecord {
    id: string;
    direction: 'in' | 'out';
    amount: number;
    accountId: string;
    operation: string;
    origin: string;
    valueDate: string;
    createdAt: string;
    /** true once reflected on the balance */
    isReflected?: boolean;
    /** record type, e.g. INSTANT_SETTLEMENT_DEDUCTION */
    type?: string;
}

// ---------------------------------------------------------------------------
// Custom-amount suggestions — nearest combinations below/above the target.
// ---------------------------------------------------------------------------

export interface SuggestionGroup {
    totalAmount: number;
    transactionsCount: number;
    transactionIds: string[];
}

export interface SuggestionsLimits {
    perRequestCap: number;
    dailyCap: number;
    remainingToday: number;
}

export interface CustomAmountSuggestions {
    targetAmount: number;
    below?: SuggestionGroup;
    above?: SuggestionGroup;
    limits?: SuggestionsLimits;
}
