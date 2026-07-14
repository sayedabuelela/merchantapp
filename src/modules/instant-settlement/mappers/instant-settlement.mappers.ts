/**
 * DTO → presentation-model mappers (pure, typed, no `any`).
 *
 * Rules:
 *  - typed in/out; never `any`
 *  - coalesce nullable fields to safe UI fallbacks (amounts → 0, text → '')
 *  - missing customer → omit the row (undefined)
 *  - guarantee a valid `createdAt` so `groupByDate`'s `new Date(...)` never
 *    yields "Invalid Date"
 *  - status stored as RAW upper-cased enum (`normalizeStatus`); rendered via StatusBox
 */

import type {
    EligibleTransactionDTO,
    EligibleSummaryDTO,
    LimitsDTO,
    InquiryResponseDTO,
    RequestDTO,
    RequestDetailsDTO,
    LinkedBalanceRecordDTO,
    StatusHistoryEntryDTO,
    CustomerDTO,
    SuggestionsDTO,
    SuggestionGroupDTO,
} from '../dto/instant-settlement.dto';
import type {
    EligibleTransaction,
    EligibleSummary,
    Limits,
    InquiryBreakdown,
    InstantRequestSummary,
    InstantRequestDetails,
    RequestRecord,
    RequestStatusHistoryEntry,
    Customer,
    RecipientInfo,
    CustomAmountSuggestions,
    SuggestionGroup,
} from '../domain/instant-settlement.models';
import { normalizeStatus } from './instant-settlement.status';

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const num = (v: number | null | undefined): number =>
    typeof v === 'number' && Number.isFinite(v) ? v : 0;

const str = (v: string | null | undefined): string => v ?? '';

/** Returns a parseable ISO date string, falling back to "now" if missing/invalid. */
const ensureValidDate = (v: string | null | undefined): string => {
    if (v && Number.isFinite(Date.parse(v))) return v;
    return new Date().toISOString();
};

const mapCustomer = (c: CustomerDTO | undefined): Customer | undefined => {
    if (!c) return undefined;
    if (!c.name && !c.phone && !c.email) return undefined;
    return { name: c.name, phone: c.phone, email: c.email };
};

// ---------------------------------------------------------------------------
// transactions
// ---------------------------------------------------------------------------

export const mapEligibleTransaction = (
    dto: EligibleTransactionDTO,
): EligibleTransaction => ({
    id: str(dto.transactionId),
    orderId: str(dto.orderId),
    operation: str(dto.operation),
    channel: str(dto.channel),
    method: str(dto.method),
    amount: num(dto.amount),
    sellingFees: num(dto.sellingFees),
    vat: num(dto.vat),
    settlementAmount: num(dto.settlementAmount),
    accountId: str(dto.accountId),
    transactionDate: str(dto.transactionDate),
    rfsDate: str(dto.rfsDate),
    createdAt: ensureValidDate(dto.transactionDate),
    // render the badge only if the API actually returned a status (raw enum)
    status: dto.status ? normalizeStatus(dto.status) : undefined,
    customer: mapCustomer(dto.customer),
});

export const mapEligibleSummary = (dto: EligibleSummaryDTO): EligibleSummary => ({
    count: num(dto.count),
    totalAmount: num(dto.totalAmount),
    totalSettlementAmount: num(dto.totalSettlementAmount),
});

export const mapLimits = (dto: LimitsDTO): Limits => ({
    perRequestCap: num(dto.perRequestCap),
    dailyCap: num(dto.dailyCap),
    usedToday: num(dto.usedToday),
    remainingToday: num(dto.remainingToday),
});

// ---------------------------------------------------------------------------
// inquiry
// ---------------------------------------------------------------------------

export const mapInquiry = (dto: InquiryResponseDTO): InquiryBreakdown => ({
    totalAmount: num(dto.totalAmount),
    totalSettlementAmount: num(dto.totalSettlementAmount),
    totalRateFees: num(dto.totalRateFees),
    vat: num(dto.vat),
    flatFees: num(dto.flatFees),
    totalFees: num(dto.totalFees),
    netTransferAmount: num(dto.netTransferAmount),
    transactionsCount: num(dto.transactionsCount),
    accountIds: Array.isArray(dto.accountIds) ? dto.accountIds : undefined,
});

// ---------------------------------------------------------------------------
// requests
// ---------------------------------------------------------------------------

export const mapRequestSummary = (dto: RequestDTO): InstantRequestSummary => ({
    id: str(dto.id),
    requestId: str(dto.requestId),
    amount: num(dto.totalAmount),
    netTransferAmount: num(dto.netTransferAmount),
    ordersCount: num(dto.transactionsCount),
    status: normalizeStatus(dto.status),
    createdAt: ensureValidDate(dto.createdAt),
});

/**
 * Accepts an ALREADY-UNWRAPPED `RequestDetailsDTO` (the service unwraps
 * `response.data.data`, Codex #1). Tolerates absent `feeConfigSnapshot` /
 * `payoutMethodsByAccount` / `linkedBalanceRecords` / `statusHistory`.
 */
export const mapRequestDetails = (
    dto: RequestDetailsDTO,
): InstantRequestDetails => {
    const payoutMethods: RecipientInfo[] = dto.payoutMethodsByAccount
        ? Object.entries(dto.payoutMethodsByAccount).map(([accountId, m]) => ({
              accountId,
              payoutMethod: str(m.payoutMethod),
              accountHolderName: str(m.accountHolderName),
              accountNumber: str(m.accountNumber),
              bankName: str(m.bankName),
              bankAbbreviation: str(m.bankAbbreviation),
              bankBranchName: str(m.bankBranchName),
              bankBranchCode: str(m.bankBranchCode),
          }))
        : [];

    return {
        id: str(dto.id),
        requestId: str(dto.requestId),
        merchantName: str(dto.merchantName),
        storeName: str(dto.storeName),
        status: normalizeStatus(dto.status),
        declineReason: dto.declineReason ?? undefined,
        totalAmount: num(dto.totalAmount),
        totalSettlementAmount: num(dto.totalSettlementAmount),
        totalRateFees: num(dto.totalRateFees),
        flatFees: num(dto.flatFees),
        vat: num(dto.vat),
        totalFees: num(dto.totalFees),
        netTransferAmount: num(dto.netTransferAmount),
        transactionsCount: num(dto.transactionsCount),
        requestedBy: str(dto.requestedBy),
        createdAt: ensureValidDate(dto.createdAt),
        updatedAt: ensureValidDate(dto.updatedAt),
        payoutMethods,
        feeSnapshot: dto.feeConfigSnapshot
            ? { rate: num(dto.feeConfigSnapshot.rate), flat: num(dto.feeConfigSnapshot.flat) }
            : undefined,
        records: (dto.linkedBalanceRecords ?? []).map(mapRequestRecord),
        recordsUnavailable: !!dto.linkedBalanceRecordsUnavailable,
        statusHistory: mapRequestStatusHistory(dto.statusHistory),
        limits: dto.limits ? mapLimits(dto.limits) : undefined,
        unselectedTransactions: (dto.unselectedTransactions ?? []).map(mapEligibleTransaction),
    };
};

export const mapRequestRecord = (
    dto: LinkedBalanceRecordDTO,
    index: number,
): RequestRecord => ({
    id: `${str(dto.recordId)}-${str(dto.accountId)}-${index}`,
    direction: num(dto.amount) < 0 ? 'out' : 'in',
    amount: Math.abs(num(dto.amount)),
    accountId: str(dto.accountId),
    accountName: str(dto.accountName),
    operation: str(dto.operation),
    origin: str(dto.origin),
    valueDate: str(dto.valueDate),
    createdAt: ensureValidDate(dto.valueDate),
    isReflected: !!dto.isReflected,
    type: str(dto.type),
});

/** History tab — coalesce missing/absent `statusHistory` to [] (Codex #4). */
export const mapRequestStatusHistory = (
    entries: StatusHistoryEntryDTO[] | null | undefined,
): RequestStatusHistoryEntry[] =>
    (entries ?? []).map((e) => ({
        status: normalizeStatus(e.status),
        at: ensureValidDate(e.at),
    }));

// ---------------------------------------------------------------------------
// suggestions — backend-provided transaction sets (never computed client-side)
// ---------------------------------------------------------------------------

const mapSuggestionGroup = (
    g: SuggestionGroupDTO | undefined,
): SuggestionGroup | undefined => {
    if (!g) return undefined;
    return {
        totalAmount: num(g.totalAmount),
        transactionsCount: num(g.transactionsCount),
        transactionIds: Array.isArray(g.transactionIds) ? g.transactionIds : [],
    };
};

export const mapSuggestions = (
    dto: SuggestionsDTO | null | undefined,
): CustomAmountSuggestions => ({
    targetAmount: num(dto?.targetAmount),
    below: mapSuggestionGroup(dto?.below),
    above: mapSuggestionGroup(dto?.above),
    limits: dto?.limits
        ? {
              perRequestCap: num(dto.limits.perRequestCap),
              dailyCap: num(dto.limits.dailyCap),
              remainingToday: num(dto.limits.remainingToday),
          }
        : undefined,
});
