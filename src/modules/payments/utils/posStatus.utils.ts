import { Transaction, TransactionDetail, PaymentSession, OrderDetailPayment } from '../payments.model';

/**
 * Check if transaction is from POS (iso8583 provider)
 */
export const isPosTransaction = (provider?: string): boolean =>
    provider?.toLowerCase() === 'iso8583';

/**
 * Check if transaction is an approved pay/void/refund operation
 */
export const isApprovedPosPayOperation = (
    status?: string,
    type?: string,
    operation?: string
): boolean => {
    const isApproved = status === 'Approved' || status?.toUpperCase() === 'SUCCESS';
    const validTypes = ['PAYMENT', 'REFUND', 'REVERSAL'];
    const validOperations = ['pay', 'void', 'refund'];
    const isValidType = !!(type && validTypes.includes(type.toUpperCase()));
    const isValidOperation = !!(operation && validOperations.includes(operation.toLowerCase()));
    return isApproved && (isValidType || isValidOperation);
};

interface PosStatusInput {
    provider?: string;
    status: string;
    type?: string;
    operation?: string;
    isReversed?: boolean;
    ackStatus?: 'pending' | 'done' | string;
}

/**
 * Get effective display status for POS transactions
 * Returns: 'REVERSED' | 'PENDING_ACK' | original status
 */
export const getEffectivePosStatus = (transaction: PosStatusInput): string => {
    // Check if conditions apply
    if (!isPosTransaction(transaction.provider)) return transaction.status;
    if (!isApprovedPosPayOperation(transaction.status, transaction.type, transaction.operation)) {
        return transaction.status;
    }

    // Apply status override logic
    if (transaction.isReversed) return 'REVERSED';
    if (transaction.ackStatus === 'pending') return 'PENDING_ACK';
    return transaction.status; // Normal approved
};

/**
 * Get effective display status for Transaction list item
 */
export const getEffectiveTransactionStatus = (transaction: Transaction): string => {
    return getEffectivePosStatus({
        provider: transaction.provider,
        status: transaction.status,
        type: transaction.type,
        operation: transaction.operation,
        isReversed: transaction.isReversed,
        ackStatus: transaction.ackStatus,
    });
};

/**
 * Get effective display status for TransactionDetail
 */
export const getEffectiveTransactionDetailStatus = (transaction: TransactionDetail): string => {
    return getEffectivePosStatus({
        provider: transaction.provider,
        status: transaction.status,
        type: transaction.trxType,
        operation: transaction.trxType,
        isReversed: transaction.isReversed,
        ackStatus: transaction.ackStatus,
    });
};

/**
 * Get message key and severity for POS status
 * reversed = danger, pending = warning
 */
export const getPosStatusWarningKey = (transaction: TransactionDetail): { key: string; severity: 'danger' | 'warning' } | null => {
    if (!isPosTransaction(transaction.provider)) return null;
    if (!isApprovedPosPayOperation(transaction.status, transaction.trxType, transaction.trxType)) return null;

    if (transaction.isReversed) return { key: 'pos_reversed_warning', severity: 'danger' };
    if (transaction.ackStatus === 'pending') return { key: 'pos_pending_warning', severity: 'warning' };
    return null;
};

/**
 * Check if a session status implies an approved pay/void/refund operation.
 * Used as fallback when order history is unavailable.
 */
const isApprovedSessionStatus = (status?: string): boolean => {
    const approvedStatuses = ['PAID', 'VOIDED', 'REFUNDED', 'PARTIALLY_REFUNDED'];
    return !!status && approvedStatuses.includes(status.toUpperCase());
};

/**
 * Get effective display status for PaymentSession (order list)
 */
export const getEffectiveOrderStatus = (order: PaymentSession): string => {
    if (!isPosTransaction(order.provider)) return order.status;

    // Try history-based check first
    const latestHistory = order.history?.[0];
    const isApproved = latestHistory
        ? isApprovedPosPayOperation(latestHistory.status, undefined, latestHistory.operation)
        : isApprovedSessionStatus(order.status);

    if (!isApproved) return order.status;

    if (order.isReversed) return 'REVERSED';
    if (order.ackStatus === 'pending') return 'PENDING_ACK';
    return order.status;
};

/**
 * Get effective display status for OrderDetailPayment (order detail)
 */
export const getEffectiveOrderDetailStatus = (order: OrderDetailPayment): string => {
    if (!isPosTransaction(order.provider)) return order.status;

    const latestHistory = order.history?.[0];
    const isApproved = latestHistory
        ? isApprovedPosPayOperation(latestHistory.status, undefined, latestHistory.operation)
        : isApprovedSessionStatus(order.status);

    if (!isApproved) return order.status;

    if (order.isReversed) return 'REVERSED';
    if (order.ackStatus === 'pending') return 'PENDING_ACK';
    return order.status;
};

/**
 * Get message key and severity for POS order status
 */
export const getOrderPosStatusWarningKey = (order: OrderDetailPayment): { key: string; severity: 'danger' | 'warning' } | null => {
    if (!isPosTransaction(order.provider)) return null;

    const latestHistory = order.history?.[0];
    const isApproved = latestHistory
        ? isApprovedPosPayOperation(latestHistory.status, undefined, latestHistory.operation)
        : isApprovedSessionStatus(order.status);

    if (!isApproved) return null;

    if (order.isReversed) return { key: 'pos_reversed_warning', severity: 'danger' };
    if (order.ackStatus === 'pending') return { key: 'pos_pending_warning', severity: 'warning' };
    return null;
};
