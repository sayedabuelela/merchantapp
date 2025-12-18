/**
 * List Eligibility Validators
 *
 * Simplified validators for payment list data (PaymentSession)
 *
 * List APIs don't return complete data like:
 * - sourceOfFunds (needed for POS refund detection)
 * - lastTransactionType (needed for transaction type validation)
 * - Complete PCC data (needed for bank cutoff checks)
 *
 * These validators use only the fields available in list responses.
 * For full validation, users should navigate to detail screens.
 */

import type { PaymentSession, Transaction } from '../payments.model';

/**
 * Checks if current time is within 24 hours of the transaction date
 */
const isWithin24Hours = (dateString: string): boolean => {
    const transactionDate = new Date(dateString);
    if (isNaN(transactionDate.getTime())) return false;

    const currentTime = new Date();
    const hoursDiff = (currentTime.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
};

// Bank-specific void windows (cutoff times in 24-hour format)
const MPGS_VOID_WINDOWS = {
    bm: { hour: 23, minute: 59 },    // Banque Misr - 11:59 PM
    nbe: { hour: 17, minute: 59 },   // National Bank of Egypt - 5:59 PM
    qnb: { hour: 23, minute: 0 },    // Qatar National Bank - 11:00 PM
} as const;

type BankName = keyof typeof MPGS_VOID_WINDOWS;

/**
 * Checks if current time is within the bank's void window
 */
const bankCutOffChecker = (
    bankName: BankName | undefined,
    transactionDate: Date
): boolean => {
    if (
        !bankName ||
        !(transactionDate instanceof Date) ||
        !MPGS_VOID_WINDOWS[bankName]
    ) {
        return false;
    }

    const { hour, minute } = MPGS_VOID_WINDOWS[bankName];
    const currentTime = new Date();

    const voidWindowStart = new Date(transactionDate);
    voidWindowStart.setHours(hour, minute, 0, 0);

    const voidWindowEnd = new Date(voidWindowStart);
    if (transactionDate >= voidWindowStart) {
        voidWindowEnd.setDate(voidWindowEnd.getDate() + 1);
    }

    return currentTime < voidWindowEnd;
};

/**
 * Check if void is available for an order from list data
 *
 * Void Rules (matches detail screen logic):
 * - Card Online only (no POS, no Wallet, no BNPL)
 * - Status is PAID/approved/success/authorized
 * - No refunds yet
 * - Not already voided
 * - Within void window (bank-specific for MPGS, 24-hour for others)
 *
 * For MPGS specifically:
 * - lastTransactionType must be payment/pay/authorize/capture
 * - pcc.rfs_due_after must NOT be 0
 * - Not an authorize-and-captured transaction
 */
export const isVoidEligibleFromList = (order: PaymentSession): boolean => {
    if (!order) return false;

    const normalizedStatus = order.status?.toLowerCase() || '';

    // RULE: No void for POS transactions
    const isPosTransaction = order.paymentChannel?.toLowerCase() === 'pos' ||
        order.paymentParams?.interactionSource?.toLowerCase() === 'pos';
    if (isPosTransaction) return false;

    // RULE: No void for Installment Orders (List)
    if (order.installmentDetails) return false;

    // RULE: Only Card payments can be voided
    const isCardMethod = order.method?.toLowerCase() === 'card';
    if (!isCardMethod) return false;

    // Common checks for all card payments
    const isApprovedStatus = ['paid', 'approved', 'success', 'authorized'].includes(normalizedStatus);
    const noRefunds = order.refundedAmount === 0;
    const isNotVoided = normalizedStatus !== 'voided';

    if (!isApprovedStatus || !noRefunds || isNotVoided === false) {
        return false;
    }

    // Parse transaction date for time-based checks
    const transactionDate = new Date(order.createdAt);
    if (isNaN(transactionDate.getTime())) {
        return false;
    }

    // MPGS-specific validation (stricter requirements)
    const isMpgsProvider = order.provider?.toLowerCase() === 'mpgs';

    if (isMpgsProvider) {
        // If MPGS fields are not available, cannot validate - return false
        // Relaxed check: valid if lastTransactionType is missing OR matches allowed types
        const lastTrxType = order.lastTransactionType?.toLowerCase();
        if (lastTrxType) {
            const isPaymentType = ['payment', 'pay', 'دفع', 'authorize', 'capture'].includes(lastTrxType);
            if (!isPaymentType) return false;
        }

        // RFS date check
        const isRfsDateEqualZero = order.pcc?.rfs_due_after === 0;
        if (isRfsDateEqualZero) return false;

        // Bank void window check
        const bankName = order.pcc?.financial_institution as BankName | undefined;
        const isKnownBank = bankName ? bankName in MPGS_VOID_WINDOWS : false;
        const isValidVoidWindow = isKnownBank
            ? bankCutOffChecker(bankName, transactionDate)
            : isWithin24Hours(order.createdAt); // Fallback to 24-hour rule

        if (!isValidVoidWindow) return false;

        // Check if authorize-and-captured (cannot void these)
        const isAuthorizeAndCaptured =
            lastTrxType === 'authorize' &&
            order.history?.some(trx => trx.operation?.toLowerCase() === 'capture');
        if (isAuthorizeAndCaptured) return false;

        return true;
    }

    // For non-MPGS card payments, apply 24-hour rule
    return isWithin24Hours(order.createdAt);
};

/**
 * Check if refund is available for an order from list data
 *
 * Matches detail screen validation logic (isRefundAvailable):
 * - Status is PAID/approved/success (NOT 'authorized' - those need capture first)
 * - Has refundable amount
 * - Method is not cash
 * - Not a POS transaction (POS refunds require cardDataToken only available in detail screen)
 */
export const isRefundEligibleFromList = (order: PaymentSession): boolean => {
    if (!order) return false;

    const normalizedStatus = order.status?.toLowerCase() || '';

    // Status must be paid/approved/success - NOT 'authorized' (those need capture first)
    const isApprovedStatus = ['paid', 'approved', 'success', 'partially refunded', 'partially_refunded'].includes(normalizedStatus);
    const hasRefundableAmount = order.refundedAmount < order.capturedAmount;
    const isNotCash = order.method?.toLowerCase() !== 'cash';
    // Explicitly exclude authorized orders - they need capture first before refund
    const isNotAuthorized = normalizedStatus !== 'authorized';

    // Exclude POS transactions - they need cardDataToken which is only in detail API
    const isPosTransaction = order.paymentParams?.interactionSource?.toLowerCase() === 'pos';

    // RULE: No refund for Installment Orders (List)
    if (order.installmentDetails) return false;

    return isApprovedStatus && hasRefundableAmount && isNotCash &&
        isNotAuthorized && !isPosTransaction;
};

/**
 * Check if capture is available for an order from list data
 *
 * Matches detail screen validation logic (isCaptureAvailable):
 * - Provider is MPGS
 * - Status is specifically 'AUTHORIZED' (pre-auth transactions)
 * - Not voided
 *
 * Note: Full validation requires checking lastTransactionType and history,
 * which are only available in the detail API response.
 */
export const isCaptureEligibleFromList = (order: PaymentSession): boolean => {
    if (!order) return false;

    const normalizedStatus = order.status?.toLowerCase() || '';

    const isMpgsProvider = order.provider?.toLowerCase() === 'mpgs';
    // Capture is only available for AUTHORIZED status (pre-auth transactions)
    const isAuthorizedStatus = normalizedStatus === 'authorized';
    // Not already voided
    const isNotVoided = normalizedStatus !== 'voided';

    return isMpgsProvider && isAuthorizedStatus && isNotVoided;
};

// ============================================================================
// Transaction List Validators (for Transaction type from list API)
// ============================================================================

/**
 * Check if void is available for a transaction from list data
 *
 * IMPORTANT: For MPGS transactions, void is NOT available from the list/modal
 * because the list API doesn't return required fields (trxType, pcc.rfs_due_after,
 * pcc.financial_institution) needed for proper validation.
 * Users must navigate to detail screen for MPGS void actions.
 *
 * For non-MPGS card transactions:
 * - Payment method is card (only card payments can be voided)
 * - Not a POS transaction (POS transactions cannot be voided)
 * - Not already voided
 * - No refunds yet
 * - Within 24 hours of creation
 * - Status is approved/success/paid (captured transactions)
 * - Transaction type is PAYMENT (not REFUND or REVERSAL)
 * - lastStatus is NOT 'AUTHORIZED' (authorized transactions should use capture)
 */
export const isVoidEligibleFromListTransaction = (transaction: Transaction): boolean => {
    if (!transaction) return false;

    // MPGS transactions logic relaxed to allow "Best Effort" validation from list
    const isMpgsProvider = transaction.provider?.toLowerCase() === 'mpgs';

    if (isMpgsProvider) {
        // Use 'type' property as proxy for 'trxType' since trxType is missing in list
        // List 'type' usually uppercase 'PAYMENT', detail 'trxType' usually lower 'payment'
        const type = transaction.type?.toLowerCase();
        const isPaymentType = ['payment', 'pay', 'دفع', 'authorize', 'capture'].includes(type || '');
        if (!isPaymentType) return false;

        // Note: pcc.rfs_due_after is missing / unreliable in list (often 0 in bank_rfs_due_after)
        // We skip the Strict RFS check for list view to avoid blocking valid transactions
        // Backend/Detail screen will enforce it strictly if needed.

        // Bank void window check
        // List API provides financial_institution in pcc
        const bankName = transaction.pcc?.financial_institution as any;
        const mpagVoidWindowsAny = MPGS_VOID_WINDOWS as any;
        const isKnownBank = bankName ? !!mpagVoidWindowsAny[bankName] : false;

        const transactionDate = new Date(transaction.date || transaction.createdAt);
        const isValidVoidWindow = isKnownBank
            ? bankCutOffChecker(bankName, transactionDate)
            : isWithin24Hours(transaction.date || transaction.createdAt);

        if (!isValidVoidWindow) return false;

        // Check if authorize-and-captured (cannot void these)
        // List usually has 'lastStatus' which can help
        const isAuthorizeAndCaptured = transaction.lastStatus?.toLowerCase() === 'captured' &&
            transaction.type?.toLowerCase() === 'authorize'; // Unlikely combo in list but good safety
        if (isAuthorizeAndCaptured) return false;
    }

    // RULE: No void for Installment Transactions (List)
    if (transaction.installment || transaction.paymentAgreement === 'installment') return false;

    const isCardMethod = transaction.method?.toLowerCase() === 'card';
    const isNotPos = transaction.channel?.toLowerCase() !== 'pos';
    const isNotVoided = !transaction.isVoided && transaction.status?.toLowerCase() !== 'voided';
    const noRefunds = transaction.totalRefundedAmount === 0;
    const isWithinVoidWindow = isWithin24Hours(transaction.date || transaction.createdAt);

    // Status must be approved/success/paid (captured transactions)
    const isApprovedStatus = ['approved', 'success', 'paid'].includes(
        transaction.status?.toLowerCase() || ''
    );

    // Transaction type must be PAYMENT, not REFUND or REVERSAL
    const isPaymentType = transaction.type?.toUpperCase() !== 'REFUND' &&
        transaction.type?.toUpperCase() !== 'REVERSAL';

    // lastStatus should not be AUTHORIZED (those need capture, not void)
    const isNotAuthorized = transaction.lastStatus?.toLowerCase() !== 'authorized';

    return isCardMethod && isNotPos && isNotVoided && noRefunds &&
        isWithinVoidWindow && isApprovedStatus && isPaymentType && isNotAuthorized;
};

/**
 * Check if refund is available for a transaction from list data
 *
 * Matches detail screen validation logic (isRefundAvailableForTransaction):
 * - Status is approved/success/paid
 * - Has refundable amount
 * - Method is not cash
 * - Not a POS transaction (POS refunds need cardDataToken which may not be in list)
 * - Transaction type is not REFUND (can't refund a refund)
 * - lastStatus is not AUTHORIZED (authorized transactions need capture first)
 */
export const isRefundEligibleFromListTransaction = (transaction: Transaction): boolean => {
    if (!transaction) return false;

    const isApprovedStatus = ['approved', 'success', 'paid', 'partially refunded', 'partially_refunded'].includes(
        transaction.status?.toLowerCase() || ''
    );
    const hasRefundableAmount = transaction.totalRefundedAmount < transaction.totalCapturedAmount;
    const isNotCash = transaction.method?.toLowerCase() !== 'cash';

    // Exclude POS transactions - they need cardDataToken which may not be in list
    const isPosTransaction = transaction.channel?.toLowerCase() === 'pos';

    // RULE: No refund for Installment Transactions (List)
    if (transaction.installment || transaction.paymentAgreement === 'installment') return false;

    // Transaction type must not be REFUND (can't refund a refund transaction)
    const isNotRefundType = transaction.type?.toUpperCase() !== 'REFUND';

    // lastStatus should not be AUTHORIZED (those need capture first before refund)
    const isNotAuthorized = transaction.lastStatus?.toLowerCase() !== 'authorized';

    return isApprovedStatus && hasRefundableAmount && isNotCash &&
        !isPosTransaction && isNotRefundType && isNotAuthorized;
};

/**
 * Check if capture is available for a transaction from list data
 *
 * Simplified checks (detail screen has full validation):
 * - Provider is MPGS
 * - lastStatus is 'AUTHORIZED' (indicates pre-auth waiting for capture)
 * - Not voided
 */
export const isCaptureEligibleFromListTransaction = (transaction: Transaction): boolean => {
    if (!transaction) return false;

    const isMpgsProvider = transaction.provider?.toLowerCase() === 'mpgs';
    // Use lastStatus which is 'AUTHORIZED' for pre-auth transactions
    const isAuthorizedLastStatus = transaction.lastStatus?.toLowerCase() === 'authorized';
    const isNotVoided = !transaction.isVoided && transaction.status?.toLowerCase() !== 'voided';

    return isMpgsProvider && isAuthorizedLastStatus && isNotVoided;
};
