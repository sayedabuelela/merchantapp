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

import type { PaymentSession } from '../payments.model';

/**
 * Check if void is available for an order from list data
 * 
 * Simplified checks (detail screen has full validation):
 * - MPGS provider
 * - Status is PAID/approved/success
 * - No refunds yet
 */
export const isVoidEligibleFromList = (order: PaymentSession): boolean => {
    if (!order) return false;

    const isMpgsProvider = order.provider?.toLowerCase() === 'mpgs';
    const isApprovedStatus = ['PAID', 'paid', 'approved', 'success'].includes(order.status);
    const noRefunds = order.refundedAmount === 0;

    return isMpgsProvider && isApprovedStatus && noRefunds;
};

/**
 * Check if refund is available for an order from list data
 * 
 * Simplified checks (detail screen has full validation):
 * - Status is PAID/approved/success
 * - Has refundable amount
 * - Method is not cash
 * - Not a POS transaction (POS refunds require cardDataToken only available in detail screen)
 */
export const isRefundEligibleFromList = (order: PaymentSession): boolean => {
    if (!order) return false;

    const isApprovedStatus = ['PAID', 'paid', 'approved', 'success'].includes(order.status);
    const hasRefundableAmount = order.refundedAmount < order.capturedAmount;
    const isNotCash = order.method?.toLowerCase() !== 'cash';
    
    // Exclude POS transactions - they need cardDataToken which is only in detail API
    const isPosTransaction = order.paymentParams?.interactionSource?.toLowerCase() === 'pos';

    return isApprovedStatus && hasRefundableAmount && isNotCash && !isPosTransaction;
};
