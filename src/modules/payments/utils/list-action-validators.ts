/**
 * List Action Validators
 *
 * Simplified validators for void/refund actions from the list view.
 * These work with data available in the list APIs (PaymentSession and Transaction)
 * without requiring the full detail API data.
 *
 * Note: These validators are more permissive than detail validators and don't
 * include complex validation like bank cutoff windows.
 */

import type { PaymentSession, Transaction } from '../payments.model';

/**
 * Check if void action is available for an order in the list
 *
 * Requirements:
 * - Has orderId
 * - Status is paid/success/approved
 * - No refunds processed yet
 * - Provider is MPGS (required for void)
 */
export const isVoidAvailableForOrder = (order: PaymentSession): boolean => {
    // Must have orderId
    if (!order.orderId) return false;

    // Status must be paid (sessions use "paid" status)
    const status = order.status?.toLowerCase();
    if (!status || !['paid', 'success', 'approved'].includes(status)) {
        return false;
    }

    // No refunds processed yet
    if (order.refundedAmount > 0) {
        return false;
    }

    // Provider must be MPGS
    const provider = order.provider?.toLowerCase();
    if (provider !== 'mpgs') {
        return false;
    }

    return true;
};

/**
 * Check if refund action is available for an order in the list
 *
 * Requirements:
 * - Has orderId
 * - Status is paid/success/approved
 * - Has refundable amount (capturedAmount > refundedAmount)
 * - Method is not cash
 */
export const isRefundAvailableForOrder = (order: PaymentSession): boolean => {
    // Must have orderId
    if (!order.orderId) return false;

    // Status must be paid
    const status = order.status?.toLowerCase();
    if (!status || !['paid', 'success', 'approved'].includes(status)) {
        return false;
    }

    // Must have refundable amount
    const refundableAmount = order.capturedAmount - order.refundedAmount;
    if (refundableAmount <= 0) {
        return false;
    }

    // Cannot refund cash payments
    const method = order.method?.toLowerCase();
    if (method === 'cash') {
        return false;
    }

    return true;
};

/**
 * Check if void action is available for a transaction in the list
 *
 * Requirements:
 * - Has id (Kashier orderId)
 * - Status is approved
 * - Not already voided
 * - No refunds processed yet
 * - Provider is MPGS
 */
export const isVoidAvailableForTransaction = (transaction: Transaction): boolean => {
    // Must have id (Kashier orderId)
    if (!transaction.id) return false;

    // Already voided
    if (transaction.isVoided) {
        return false;
    }

    // Status must be approved
    const status = transaction.status?.toLowerCase();
    if (!status || !['approved', 'success', 'paid'].includes(status)) {
        return false;
    }

    // No refunds processed yet
    if (transaction.totalRefundedAmount > 0) {
        return false;
    }

    // Provider must be MPGS
    const provider = transaction.provider?.toLowerCase();
    if (provider !== 'mpgs') {
        return false;
    }

    return true;
};

/**
 * Check if refund action is available for a transaction in the list
 *
 * Requirements:
 * - Has id (Kashier orderId)
 * - Status is approved
 * - Has refundable amount (totalCapturedAmount > totalRefundedAmount)
 * - Method is not cash
 */
export const isRefundAvailableForTransaction = (transaction: Transaction): boolean => {
    // Must have id (Kashier orderId)
    if (!transaction.id) return false;

    // Status must be approved
    const status = transaction.status?.toLowerCase();
    if (!status || !['approved', 'success', 'paid'].includes(status)) {
        return false;
    }

    // Must have refundable amount
    const refundableAmount = transaction.totalCapturedAmount - transaction.totalRefundedAmount;
    if (refundableAmount <= 0) {
        return false;
    }

    // Cannot refund cash payments
    const method = transaction.method?.toLowerCase();
    if (method === 'cash') {
        return false;
    }

    return true;
};
