import { OrderDetailPayment, TransactionDetail, SourceOfFunds } from '@/src/modules/payments/payments.model';

/**
 * Normalized settlement data structure for both orders and transactions
 */
export interface SettlementData {
    amount: number;
    capturedAmount: number;
    refundedAmount: number;
    fees?: string | number;
    vat?: string | number;
    settlementAmount?: string;
    sourceOfFunds?: SourceOfFunds;
}

/**
 * Adapts OrderDetailPayment to normalized SettlementData
 */
export const adaptOrderData = (order: OrderDetailPayment): SettlementData => ({
    amount: order.amount,
    capturedAmount: order.capturedAmount,
    refundedAmount: order.refundedAmount,
    fees: order.fees,
    vat: order.vat,
    settlementAmount: order.settlementAmount,
    sourceOfFunds: order.sourceOfFunds,
});

/**
 * Adapts TransactionDetail to normalized SettlementData
 */
export const adaptTransactionData = (transaction: TransactionDetail): SettlementData => ({
    amount: transaction.amount,
    capturedAmount: transaction.totalCapturedAmount,
    refundedAmount: transaction.totalRefundedAmount,
    fees: transaction.order?.feeTrxAmount,
    vat: transaction.order?.feeVatAmount,
    settlementAmount: undefined, // Transactions don't have settlementAmount
    sourceOfFunds: transaction.sourceOfFunds,
});
