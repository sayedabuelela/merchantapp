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

/**
 * Check if void is available for an order from list data
 *
 * IMPORTANT: For MPGS orders, void is NOT available from the list/modal
 * because the list API doesn't return required fields (lastTransactionType,
 * pcc.rfs_due_after, pcc.financial_institution, history) needed for proper validation.
 * Users must navigate to detail screen for MPGS void actions.
 *
 * For non-MPGS card orders:
 * - Payment method is card
 * - Status is PAID/approved/success (NOT 'authorized' - those need capture)
 * - No refunds yet
 * - Not already voided
 * - Within 24 hours of creation (default void window)
 */
export const isVoidEligibleFromList = (order: PaymentSession): boolean => {
    if (!order) return false;

    // MPGS orders require additional validation (lastTransactionType, pcc.rfs_due_after,
    // bank void window, history) that is only available in the detail API.
    // Hide void in modal for MPGS - users must go to detail screen.
    const isMpgsProvider = order.provider?.toLowerCase() === 'mpgs';
    if (isMpgsProvider) return false;

    const normalizedStatus = order.status?.toLowerCase() || '';

    const isCardMethod = order.method?.toLowerCase() === 'card';
    // Status must be paid/approved/success - NOT 'authorized' (those need capture, not void)
    const isApprovedStatus = ['paid', 'approved', 'success'].includes(normalizedStatus);
    const noRefunds = order.refundedAmount === 0;
    const isNotVoided = normalizedStatus !== 'voided';
    // Explicitly exclude authorized orders - they should use capture, not void
    const isNotAuthorized = normalizedStatus !== 'authorized';

    // Apply 24-hour rule - void only available within 24 hours of creation
    const isWithinVoidWindow = isWithin24Hours(order.createdAt);

    return isCardMethod && isApprovedStatus && noRefunds && isNotVoided &&
           isNotAuthorized && isWithinVoidWindow;
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
    const isApprovedStatus = ['paid', 'approved', 'success'].includes(normalizedStatus);
    const hasRefundableAmount = order.refundedAmount < order.capturedAmount;
    const isNotCash = order.method?.toLowerCase() !== 'cash';
    // Explicitly exclude authorized orders - they need capture first before refund
    const isNotAuthorized = normalizedStatus !== 'authorized';

    // Exclude POS transactions - they need cardDataToken which is only in detail API
    const isPosTransaction = order.paymentParams?.interactionSource?.toLowerCase() === 'pos';

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

    // MPGS transactions require additional validation (trxType, pcc.rfs_due_after,
    // bank void window) that is only available in the detail API.
    // Hide void in modal for MPGS - users must go to detail screen.
    const isMpgsProvider = transaction.provider?.toLowerCase() === 'mpgs';
    if (isMpgsProvider) return false;

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

    const isApprovedStatus = ['approved', 'success', 'paid'].includes(
        transaction.status?.toLowerCase() || ''
    );
    const hasRefundableAmount = transaction.totalRefundedAmount < transaction.totalCapturedAmount;
    const isNotCash = transaction.method?.toLowerCase() !== 'cash';

    // Exclude POS transactions - they need cardDataToken which may not be in list
    const isPosTransaction = transaction.channel?.toLowerCase() === 'pos';

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
