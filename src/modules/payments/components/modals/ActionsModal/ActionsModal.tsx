import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { Bars3BottomLeftIcon, ArrowPathIcon, XMarkIcon } from 'react-native-heroicons/outline';

import FontText from '@/src/shared/components/FontText';
import ActionItem from './ActionItem';
import { PaymentSession, Transaction } from '../../../payments.model';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { formatAMPM, formatRelativeDate } from '@/src/core/utils/dateUtils';
import { useTranslation } from 'react-i18next';
import {
    isVoidAvailable,
    isRefundAvailable,
    isVoidAvailableForTransaction,
    isRefundAvailableForTransaction,
} from '../../../utils/action-validators';
import { useOrderActionsVM } from '../../../viewmodels/useOrderActionsVM';
import { useTransactionActionsVM } from '../../../viewmodels/useTransactionActionsVM';
import ConfirmationModal from '@/src/shared/components/ConfirmationModal/ConfirmationModal';
import VoidConfirmation from '../VoidConfirmation';
import RefundConfirmation from '../RefundConfirmation';
import VoidConfirmationTransaction from '../VoidConfirmationTransaction';
import RefundConfirmationTransaction from '../RefundConfirmationTransaction';

interface Props {
    isVisible: boolean;
    onClose: () => void;
    payment: PaymentSession | Transaction;
    type: 'order' | 'transaction';
}

const isTransaction = (payment: PaymentSession | Transaction): payment is Transaction => {
    return 'merchantOrderId' in payment;
};

const PaymentActionsModal = ({ isVisible, onClose, payment, type }: Props) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(isVisible);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showVoidModal, setShowVoidModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const router = useRouter();

    // Extract orderId from payment data
    const orderId = type === 'order' 
        ? (payment as PaymentSession).orderId 
        : isTransaction(payment) ? payment.id : null;

    // Use appropriate actions viewmodel
    const orderActions = useOrderActionsVM(orderId || '');
    const transactionActions = useTransactionActionsVM(orderId || '');

    // Select the correct actions based on type
    const {
        voidOrder: voidAction,
        isVoidingOrder: isVoiding,
        refundOrder: refundAction,
        isRefundingOrder: isRefunding,
    } = type === 'order' ? orderActions : {
        voidOrder: transactionActions.voidTransaction,
        isVoidingOrder: transactionActions.isVoidingTransaction,
        refundOrder: transactionActions.refundTransaction,
        isRefundingOrder: transactionActions.isRefundingTransaction,
    };

    // Check if actions are available
    // For orders from list: use simplified checks (list API doesn't return complete data like PCC, sourceOfFunds)
    // For transactions: use full validators (transaction list has complete data)
    // User can always go to detail screen for full validation and actions
    const canVoid = type === 'order' 
        ? (() => {
            const order = payment as PaymentSession;
            // Simplified void check for list data (doesn't have complete PCC data for bank cutoff checks)
            const isMpgsProvider = order.provider?.toLowerCase() === 'mpgs';
            const isApprovedStatus = ['PAID', 'paid', 'approved', 'success'].includes(order.status);
            const noRefunds = order.refundedAmount === 0;
            
            return isMpgsProvider && isApprovedStatus && noRefunds;
        })() 
        : isVoidAvailableForTransaction({
            ...(payment as Transaction),
            date: (payment as Transaction).date || (payment as Transaction).createdAt,
            discount: null,
            paymentChannel: (payment as Transaction).channel || 'ECOMMERCE',
            paymentStatus: (payment as Transaction).status,
            trxType: (payment as Transaction).type || 'PAYMENT',
            merchantOrderId: (payment as Transaction).merchantOrderId || '',
            origin: 'portal',
            transactionResponseCode: (payment as Transaction).transactionResponseCode || '',
            transactionResponseMessage: (payment as Transaction).transactionResponseMessage || { en: '', ar: '' },
            isReversed: false,
            // Map PCCOperations to TransactionDetailPCC structure
            pcc: { 
                rfs_due_after: undefined, 
                financial_institution: undefined 
            },
            transactions: (payment as Transaction).transactions || [],
        } as any);
    
    const canRefund = type === 'order'
        ? (() => {
            const order = payment as PaymentSession;
            // Simplified refund check for list data (doesn't have sourceOfFunds or lastTransactionType)
            const isApprovedStatus = ['PAID', 'paid', 'approved', 'success'].includes(order.status);
            const hasRefundableAmount = order.refundedAmount < order.capturedAmount;
            const isNotCash = order.method?.toLowerCase() !== 'cash';
            
            return isApprovedStatus && hasRefundableAmount && isNotCash;
        })()
        : isRefundAvailableForTransaction({
            ...(payment as Transaction),
            date: (payment as Transaction).date || (payment as Transaction).createdAt,
            discount: null,
            paymentChannel: (payment as Transaction).channel || 'ECOMMERCE',
            paymentStatus: (payment as Transaction).status,
            trxType: (payment as Transaction).type || 'PAYMENT',
            merchantOrderId: (payment as Transaction).merchantOrderId || '',
            origin: 'portal',
            transactionResponseCode: (payment as Transaction).transactionResponseCode || '',
            transactionResponseMessage: (payment as Transaction).transactionResponseMessage || { en: '', ar: '' },
            isReversed: false,
            // Map PCCOperations to TransactionDetailPCC structure
            pcc: { 
                rfs_due_after: undefined, 
                financial_institution: undefined 
            },
            transactions: (payment as Transaction).transactions || [],
        } as any);

    useEffect(() => {
        if (isVisible) {
            setShowModal(true);
            requestAnimationFrame(() => {
                setIsAnimating(true);
            });
        }
    }, [isVisible]);

    const handleClose = useCallback(() => {
        setIsAnimating(false);
    }, []);

    const handleNavigateDetails = useCallback(() => {
        // For orders: use _id
        // For transactions: use transactionId
        const routeId = type === 'order'
            ? payment?._id
            : isTransaction(payment) ? payment.transactionId : null;

        if (!routeId) {
            handleClose();
            return;
        }

        if (type === 'order') {
            router.push(`/payments/${routeId}`);
        } else {
            router.push(`/payments/transaction/${routeId}`);
        }
        handleClose();
    }, [handleClose, payment, router, type]);

    // Void handlers
    const handleVoidPress = useCallback(() => {
        setShowVoidModal(true);
    }, []);

    const handleVoidConfirm = useCallback(() => {
        if (!orderId) return;
        voidAction(
            { orderId },
            {
                onSuccess: () => {
                    // Only close the confirmation modal
                    // Do NOT close the main modal - let user dismiss it manually to prevent freeze
                    setShowVoidModal(false);
                },
                onError: () => {
                    // Keep void modal open on error so user can see message and retry
                },
            }
        );
    }, [orderId, voidAction]);

    const handleVoidCancel = useCallback(() => {
        setShowVoidModal(false);
    }, []);

    // Refund handlers
    const handleRefundPress = useCallback(() => {
        setShowRefundModal(true);
    }, []);

    const handleRefundConfirm = useCallback((amount: number) => {
        if (!orderId) return;

        const currency = type === 'order'
            ? (payment as PaymentSession).paymentParams?.currency || 'EGP'
            : (payment as Transaction).currency || 'EGP';

        // Check if POS refund for transactions
        const isPosRefund = type === 'transaction' 
            ? (payment as Transaction).channel?.toLowerCase() === 'pos' &&
              (payment as Transaction).method === 'card' &&
              !!(payment as Transaction).sourceOfFunds?.cardDataToken
            : false;

        refundAction(
            {
                orderId,
                amount,
                currency,
                isPosRefund,
                merchantId: isPosRefund ? (payment as Transaction).merchantId : undefined,
                terminalId: undefined,
                cardDataToken: isPosRefund ? (payment as Transaction).sourceOfFunds?.cardDataToken : undefined,
            },
            {
                onSuccess: () => {
                    // Only close the confirmation modal
                    // Do NOT close the main modal - let user dismiss it manually to prevent freeze
                    setShowRefundModal(false);
                },
                onError: () => {
                    // Keep refund modal open on error so user can see message and retry
                },
            }
        );
    }, [orderId, payment, type, refundAction]);

    const handleRefundCancel = useCallback(() => {
        setShowRefundModal(false);
    }, []);

    // Build display data with safety checks
    const amount = isTransaction(payment)
        ? `${currencyNumber(payment?.amount ?? 0)} ${t(payment?.currency || 'EGP')}`
        : `${currencyNumber(payment?.paymentParams?.amount ?? 0)} ${t(payment?.paymentParams?.currency || 'EGP')}`;

    const status = payment?.status || '';

    const date = payment?.createdAt ? formatRelativeDate(payment.createdAt) : '';
    const time = payment?.createdAt ? formatAMPM(payment.createdAt) : '';

    const displayOrderId = isTransaction(payment)
        ? payment?.merchantOrderId || ''
        : payment?.paymentParams?.order || '';

    const displayTransactionId = isTransaction(payment)
        ? payment?.transactionId || ''
        : payment?.targetTransactionId || '';

    // Build subtitle parts
    const subtitleParts = [];
    if (date && time) subtitleParts.push(`${date}, ${time}`);
    if (displayOrderId) subtitleParts.push(displayOrderId);
    if (displayTransactionId) subtitleParts.push(displayTransactionId);
    const subtitle = subtitleParts.join(' • ');

    // Adapt list data to match confirmation modal interfaces
    // Only include fields actually used by the modals
    const orderForModal = type === 'order' ? {
        amount: (payment as PaymentSession).paymentParams?.amount || 0,
        currency: (payment as PaymentSession).paymentParams?.currency || 'EGP',
        status: (payment as PaymentSession).status,
        createdAt: (payment as PaymentSession).createdAt,
        orderId: (payment as PaymentSession).orderId || '',
        targetTransactionId: (payment as PaymentSession).targetTransactionId,
        capturedAmount: (payment as PaymentSession).capturedAmount || 0,
        refundedAmount: (payment as PaymentSession).refundedAmount || 0,
    } : null;

    const transactionForModal = type === 'transaction' ? {
        amount: (payment as Transaction).amount || 0,
        currency: (payment as Transaction).currency || 'EGP',
        status: (payment as Transaction).status,
        date: (payment as Transaction).date,
        transactionId: (payment as Transaction).transactionId || '',
        merchantOrderId: (payment as Transaction).merchantOrderId || '',
        totalCapturedAmount: (payment as Transaction).totalCapturedAmount || 0,
        totalRefundedAmount: (payment as Transaction).totalRefundedAmount || 0,
    } : null;

    // Safety check: if no payment data, don't render
    if (!payment) {
        return null;
    }

    return (
        <Modal
            transparent
            visible={showModal}
            animationType="none"
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <AnimatePresence onExitComplete={() => {
                setShowModal(false);
                setIsAnimating(false);
                onClose();
            }}>
                {isAnimating && (
                    <View className="flex-1 justify-end">
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                type: 'timing',
                                duration: 200
                            }}
                            className="absolute inset-0 bg-content-secondary/30"
                        >
                            <Pressable style={{ flex: 1 }} onPress={handleClose} />
                        </MotiView>

                        <TouchableWithoutFeedback>
                            <MotiView
                                from={{ translateY: 450 }}
                                animate={{ translateY: 0 }}
                                exit={{ translateY: 450 }}
                                transition={{
                                    type: 'timing',
                                    duration: 400
                                }}
                                className="bg-white w-full rounded-t-3xl pt-4 pb-12 px-6"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: -2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3,
                                    elevation: 5,
                                }}
                            >
                                <View className="w-8 h-[3px] bg-content-secondary rounded-full self-center mb-8" />

                                <View className="flex-row justify-between items-center mb-4">
                                    <View>
                                        <View className="flex-row items-center gap-x-2 mb-1">
                                            <FontText type="head" weight="bold" className="text-content-primary text-xl">
                                                {amount}
                                            </FontText>
                                            {status && <StatusBox status={status} />}
                                        </View>
                                        {subtitle && (
                                            <FontText type="body" weight="regular" className="text-light-gray text-xs">
                                                {subtitle}
                                            </FontText>
                                        )}
                                    </View>
                                </View>

                                {/* Actions */}
                                <View className="gap-y-2">
                                    <ActionItem
                                        icon={<Bars3BottomLeftIcon size={24} color="#001F5F" />}
                                        title={t("Details")}
                                        onPress={handleNavigateDetails}
                                    />
                                    {canVoid && orderId && (
                                        <ActionItem
                                            icon={<XMarkIcon size={24} color="#D32F2F" />}
                                            title={t("Void")}
                                            onPress={handleVoidPress}
                                            isLoading={isVoiding}
                                            variant="danger"
                                        />
                                    )}
                                    {canRefund && orderId && (
                                        <ActionItem
                                            icon={<ArrowPathIcon size={24} color="#D32F2F" />}
                                            title={t("Refund")}
                                            onPress={handleRefundPress}
                                            isLoading={isRefunding}
                                            variant="danger"
                                        />
                                    )}
                                </View>
                            </MotiView>
                        </TouchableWithoutFeedback>
                    </View>
                )}
            </AnimatePresence>

            {/* Nested Confirmation Modals */}
            {type === 'order' && orderForModal && (
                <>
                    <ConfirmationModal
                        isVisible={showVoidModal}
                        onClose={handleVoidCancel}
                        title={t("Void Transaction")}
                    >
                        <VoidConfirmation
                            order={orderForModal as any}
                            onConfirm={handleVoidConfirm}
                            onCancel={handleVoidCancel}
                            isVoiding={isVoiding}
                        />
                    </ConfirmationModal>

                    <ConfirmationModal
                        isVisible={showRefundModal}
                        onClose={handleRefundCancel}
                        title={t("Refund Order")}
                    >
                        <RefundConfirmation
                            order={orderForModal as any}
                            onConfirm={handleRefundConfirm}
                            onCancel={handleRefundCancel}
                            isRefunding={isRefunding}
                        />
                    </ConfirmationModal>
                </>
            )}

            {type === 'transaction' && transactionForModal && (
                <>
                    <ConfirmationModal
                        isVisible={showVoidModal}
                        onClose={handleVoidCancel}
                        title={t("Void Transaction")}
                    >
                        <VoidConfirmationTransaction
                            transaction={transactionForModal as any}
                            onConfirm={handleVoidConfirm}
                            onCancel={handleVoidCancel}
                            isVoiding={isVoiding}
                        />
                    </ConfirmationModal>

                    <ConfirmationModal
                        isVisible={showRefundModal}
                        onClose={handleRefundCancel}
                        title={t("Refund Transaction")}
                    >
                        <RefundConfirmationTransaction
                            transaction={transactionForModal as any}
                            onConfirm={handleRefundConfirm}
                            onCancel={handleRefundCancel}
                            isRefunding={isRefunding}
                        />
                    </ConfirmationModal>
                </>
            )}
        </Modal>
    );
};

export default memo(PaymentActionsModal);
