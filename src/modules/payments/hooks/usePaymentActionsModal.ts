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

        // Get cardDataToken based on type
        let cardDataToken: string | undefined;
        if (type === 'order') {
            cardDataToken = (payment as PaymentSession).sourceOfFunds?.cardDataToken ||
                           (payment as PaymentSession).sourceOfFunds?.cardInfo?.cardDataToken;
        } else {
            cardDataToken = (payment as Transaction).sourceOfFunds?.cardDataToken ||
                           (payment as Transaction).sourceOfFunds?.cardInfo?.cardDataToken;
        }

        // Determine if POS refund
        let isPosRefund = false;
        if (type === 'order') {
            isPosRefund = (payment as PaymentSession).paymentChannel?.toLowerCase() === 'pos' &&
                         (payment as PaymentSession).method === 'card' &&
                         !!cardDataToken;
        } else {
            isPosRefund = (payment as Transaction).channel?.toLowerCase() === 'pos' &&
                         (payment as Transaction).method === 'card' &&
                         !!cardDataToken;
        }

        // Determine the refund orderId based on type and POS status
        let refundOrderId: string;
        if (type === 'order') {
            // For POS order refunds, use paymentParams.order (e.g., POS-271849111959726577171)
            refundOrderId = isPosRefund
                ? (payment as PaymentSession).paymentParams?.order || orderId!
                : orderId!;
        } else {
            // For POS transaction refunds, use transaction.id (UUID format)
            refundOrderId = isPosRefund && (payment as Transaction).id
                ? (payment as Transaction).id
                : orderId!;
        }

        // Build refund params
        if (type === 'order') {
            return {
                orderId: refundOrderId,
                amount,
                currency,
                isPosRefund,
                merchantId: isPosRefund ? (payment as PaymentSession).merchantId : undefined,
                terminalId: isPosRefund ? (payment as PaymentSession).posTerminal?.terminalId : undefined,
                cardDataToken: isPosRefund ? cardDataToken : undefined,
            };
        } else {
            return {
                orderId: refundOrderId,
                amount,
                currency,
                isPosRefund,
                merchantId: isPosRefund ? (payment as Transaction).merchantId : undefined,
                terminalId: isPosRefund ? (payment as Transaction).posTerminal?.terminalId : undefined,
                cardDataToken: isPosRefund ? cardDataToken : undefined,
                targetTransactionId: isPosRefund ? (payment as Transaction).transactionId : undefined,
            };
        }
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
