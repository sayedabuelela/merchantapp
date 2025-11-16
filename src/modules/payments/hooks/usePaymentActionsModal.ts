/**
 * Hook for Payment Actions Modal
 * 
 * Handles eligibility checks and action execution for both orders and transactions
 * from list views (which have limited data compared to detail screens)
 */

import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import type { PaymentSession, Transaction } from '../payments.model';
import { useOrderActionsVM } from '../viewmodels/useOrderActionsVM';
import { useTransactionActionsVM } from '../viewmodels/useTransactionActionsVM';
import {
    isVoidAvailableForTransaction,
    isRefundAvailableForTransaction,
} from '../utils/action-validators';
import {
    isVoidEligibleFromList,
    isRefundEligibleFromList,
} from '../utils/list-eligibility-validators';

interface UsePaymentActionsModalParams {
    payment: PaymentSession | Transaction;
    type: 'order' | 'transaction';
    orderId: string | null | undefined;
}

const isTransaction = (payment: PaymentSession | Transaction): payment is Transaction => {
    return 'merchantOrderId' in payment;
};

export const usePaymentActionsModal = ({
    payment,
    type,
    orderId,
}: UsePaymentActionsModalParams) => {
    const router = useRouter();
    const orderActions = useOrderActionsVM(orderId || '');
    const transactionActions = useTransactionActionsVM(orderId || '');

    // Select appropriate actions based on type
    const voidAction = type === 'order' 
        ? orderActions.voidOrder 
        : transactionActions.voidTransaction;
    const refundAction = type === 'order'
        ? orderActions.refundOrder
        : transactionActions.refundTransaction;
    const isVoiding = type === 'order'
        ? orderActions.isVoidingOrder
        : transactionActions.isVoidingTransaction;
    const isRefunding = type === 'order'
        ? orderActions.isRefundingOrder
        : transactionActions.isRefundingTransaction;

    // Check eligibility
    const canVoid = type === 'order'
        ? isVoidEligibleFromList(payment as PaymentSession)
        : isVoidAvailableForTransaction(mapTransactionForValidator(payment as Transaction));

    const canRefund = type === 'order'
        ? isRefundEligibleFromList(payment as PaymentSession)
        : isRefundAvailableForTransaction(mapTransactionForValidator(payment as Transaction));

    // Navigation
    const navigateToDetails = useCallback(() => {
        const routeId = type === 'order'
            ? payment?._id
            : isTransaction(payment) ? payment.transactionId : null;

        if (!routeId) return;

        if (type === 'order') {
            router.push(`/payments/${routeId}`);
        } else {
            router.push(`/payments/transaction/${routeId}`);
        }
    }, [payment, router, type]);

    // Refund logic
    const getRefundParams = useCallback((amount: number) => {
        const currency = type === 'order'
            ? (payment as PaymentSession).paymentParams?.currency || 'EGP'
            : (payment as Transaction).currency || 'EGP';

        const isPosRefund = type === 'transaction'
            ? (payment as Transaction).channel?.toLowerCase() === 'pos' &&
              (payment as Transaction).method === 'card' &&
              !!(payment as Transaction).sourceOfFunds?.cardDataToken
            : false;

        return {
            orderId: orderId!,
            amount,
            currency,
            isPosRefund,
            merchantId: isPosRefund ? (payment as Transaction).merchantId : undefined,
            terminalId: undefined,
            cardDataToken: isPosRefund ? (payment as Transaction).sourceOfFunds?.cardDataToken : undefined,
        };
    }, [orderId, payment, type]);

    return {
        canVoid,
        canRefund,
        voidAction,
        refundAction,
        isVoiding,
        isRefunding,
        navigateToDetails,
        getRefundParams,
    };
};

/**
 * Map Transaction from list to TransactionDetail structure for validators
 */
function mapTransactionForValidator(transaction: Transaction): any {
    return {
        ...transaction,
        date: transaction.date || transaction.createdAt,
        discount: null,
        paymentChannel: transaction.channel || 'ECOMMERCE',
        paymentStatus: transaction.status,
        trxType: transaction.type || 'PAYMENT',
        merchantOrderId: transaction.merchantOrderId || '',
        origin: 'portal',
        transactionResponseCode: transaction.transactionResponseCode || '',
        transactionResponseMessage: transaction.transactionResponseMessage || { en: '', ar: '' },
        isReversed: false,
        pcc: {
            rfs_due_after: undefined,
            financial_institution: undefined,
        },
        transactions: transaction.transactions || [],
    };
}
