import {
    OrderDetailPayment,
    TransactionDetail,
    SourceOfFunds,
    OrderDetailPosTerminal,
    InstallmentDetails,
    InstallmentFees
} from '@/src/modules/payments/payments.model';

/**
 * Normalized settlement data structure for both orders and transactions
 */
export interface SettlementData {
    // Financial fields
    amount: number;
    capturedAmount: number;
    refundedAmount: number;
    fees?: string | number;
    vat?: string | number;
    settlementAmount?: string;
    earlySettlementFees?: number;
    rfsDate?: string;
    sourceOfFunds?: SourceOfFunds;
    currency?: string;

    // Order Info fields
    authorizationId?: string;
    merchantType?: string;
    merchantReference?: string;

    // Terminal Info fields (POS)
    posTerminal?: OrderDetailPosTerminal;
    paymentChannel?: string;

    // Bank Installment fields
    installmentDetails?: InstallmentDetails;
    installmentFees?: InstallmentFees;
}

/**
 * Adapts OrderDetailPayment to normalized SettlementData
 */
export const adaptOrderData = (order: OrderDetailPayment): SettlementData => ({
    // Financial fields
    amount: order.amount,
    capturedAmount: order.capturedAmount,
    refundedAmount: order.refundedAmount,
    fees: order.fees,
    vat: order.vat,
    settlementAmount: order.settlementAmount,
    earlySettlementFees: order.earlySettlementFees,
    rfsDate: order.rfsDate,
    sourceOfFunds: order.sourceOfFunds,
    currency: order.currency,

    // Order Info fields
    authorizationId: order.targetTransactionId,
    merchantType: order.merchantType,
    merchantReference: order.merchantOrderId,

    // Terminal Info fields (POS)
    posTerminal: order.posTerminal,
    paymentChannel: order.paymentChannel,

    // Bank Installment fields
    installmentDetails: order.installmentDetails,
    installmentFees: order.installmentFees,
});

/**
 * Adapts TransactionDetail to normalized SettlementData
 */
export const adaptTransactionData = (transaction: TransactionDetail): SettlementData => ({
    // Financial fields
    amount: transaction.amount,
    capturedAmount: transaction.totalCapturedAmount,
    refundedAmount: transaction.totalRefundedAmount,
    fees: transaction.order?.feeTrxAmount,
    vat: transaction.order?.feeVatAmount,
    settlementAmount: undefined, // Transactions don't have settlementAmount
    rfsDate: transaction.rfsDate,
    sourceOfFunds: transaction.sourceOfFunds,
    currency: transaction.currency,
    earlySettlementFees: transaction.order?.earlySettlementFees,
    // Order Info fields
    authorizationId: transaction.transactionId,
    merchantType: transaction.order?.accountType,
    merchantReference: transaction.order?.orderReference || transaction.merchantOrderId,

    // Terminal Info fields (POS) - Transactions may not have posTerminal directly
    posTerminal: undefined,
    paymentChannel: transaction.paymentChannel,

    // Bank Installment fields
    installmentDetails: transaction.installmentDetails,
    installmentFees: transaction.installmentFees,
});
