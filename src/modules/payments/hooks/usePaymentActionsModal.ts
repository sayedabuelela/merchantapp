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
    isVoidEligibleFromList,
    isRefundEligibleFromList,
    isCaptureEligibleFromList,
    isVoidEligibleFromListTransaction,
    isRefundEligibleFromListTransaction,
    isCaptureEligibleFromListTransaction,
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
    const captureAction = type === 'order'
        ? orderActions.captureOrder
        : transactionActions.captureTransaction;
    const isVoiding = type === 'order'
        ? orderActions.isVoidingOrder
        : transactionActions.isVoidingTransaction;
    const isRefunding = type === 'order'
        ? orderActions.isRefundingOrder
        : transactionActions.isRefundingTransaction;
    const isCapturing = type === 'order'
        ? orderActions.isCapturingOrder
        : transactionActions.isCapturingTransaction;

    // Check eligibility using list-specific validators
    // These validators use only fields available in list API responses
    const canVoid = type === 'order'
        ? isVoidEligibleFromList(payment as PaymentSession)
        : isVoidEligibleFromListTransaction(payment as Transaction);

    const canRefund = type === 'order'
        ? isRefundEligibleFromList(payment as PaymentSession)
        : isRefundEligibleFromListTransaction(payment as Transaction);

    const canCapture = type === 'order'
        ? isCaptureEligibleFromList(payment as PaymentSession)
        : isCaptureEligibleFromListTransaction(payment as Transaction);

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
        canCapture,
        voidAction,
        refundAction,
        captureAction,
        isVoiding,
        isRefunding,
        isCapturing,
        navigateToDetails,
        getRefundParams,
    };
};
