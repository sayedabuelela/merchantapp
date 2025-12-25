import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { Bars3BottomLeftIcon, ArrowPathIcon, XMarkIcon, CheckCircleIcon, ArrowUturnLeftIcon } from 'react-native-heroicons/outline';

import FontText from '@/src/shared/components/FontText';
import ActionItem from './ActionItem';
import { PaymentSession, Transaction } from '../../../payments.model';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { formatAMPM, formatRelativeDate } from '@/src/core/utils/dateUtils';
import { useTranslation } from 'react-i18next';
import { usePaymentActionsModal } from '../../../hooks/usePaymentActionsModal';
import ConfirmationModal from '@/src/shared/components/ConfirmationModal/ConfirmationModal';
import VoidConfirmation from '../VoidConfirmation';
import RefundConfirmation from '../RefundConfirmation';
import CaptureConfirmation from '../CaptureConfirmation';
import VoidConfirmationTransaction from '../VoidConfirmationTransaction';
import RefundConfirmationTransaction from '../RefundConfirmationTransaction';
import CaptureConfirmationTransaction from '../CaptureConfirmationTransaction';
import usePermissions from '@/src/modules/auth/hooks/usePermissions';
import { useAuthStore } from '@/src/modules/auth/auth.store';
import { selectUser } from '@/src/modules/auth/auth.store';
import { BlurView } from 'expo-blur';

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
    const [showCaptureModal, setShowCaptureModal] = useState(false);
    const user = useAuthStore(selectUser);
    const currentMerchantId = user?.merchantId;
    const { canRefundTransactions } = usePermissions(user?.actions || {});
    console.log('canRefundTransactions', canRefundTransactions);
    // Extract orderId from payment data
    const orderId = type === 'order'
        ? (payment as PaymentSession).orderId
        : isTransaction(payment) ? payment.id : null;

    // Use payment actions hook for all eligibility and action handling
    const {
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
    } = usePaymentActionsModal({ payment, type, orderId });

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
        navigateToDetails();
        handleClose();
    }, [handleClose, navigateToDetails]);

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
                    // Close confirmation modal
                    setShowVoidModal(false);
                    // Close main modal after delay to prevent freeze during query invalidation/updates
                    setTimeout(() => {
                        handleClose();
                    }, 500);
                },
                onError: (e) => {
                    console.log('handleVoidConfirm error', e);
                    // Keep void modal open on error so user can see message and retry
                    setShowVoidModal(false);
                    setTimeout(() => {
                        handleClose();
                    }, 500);
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

        refundAction(
            getRefundParams(amount),
            {
                onSuccess: () => {
                    // Close confirmation modal
                    setShowRefundModal(false);
                    // Close main modal after delay to prevent freeze during query invalidation/updates
                    setTimeout(() => {
                        handleClose();
                    }, 500);
                },
                onError: (e) => {
                    // Keep refund modal open on error so user can see message and retry
                    console.log('handleRefundConfirm error', e);
                    setShowRefundModal(false);
                    setTimeout(() => {
                        handleClose();
                    }, 500);
                },
            }
        );
    }, [orderId, refundAction, getRefundParams]);

    const handleRefundCancel = useCallback(() => {
        setShowRefundModal(false);
        setTimeout(() => {
            handleClose();
        }, 500);
    }, [handleClose]);

    // Capture handlers
    const handleCapturePress = useCallback(() => {
        setShowCaptureModal(true);
    }, []);

    const handleCaptureConfirm = useCallback(() => {
        if (!orderId) return;
        captureAction(
            { orderId },
            {
                onSuccess: () => {
                    // Close confirmation modal
                    setShowCaptureModal(false);
                    // Close main modal after delay to prevent freeze during query invalidation/updates
                    setTimeout(() => {
                        handleClose();
                    }, 500);
                },
                onError: (e) => {
                    // Keep capture modal open on error so user can see message and retry
                    console.log('handleCaptureConfirm error', e);
                    setShowCaptureModal(false);
                    setTimeout(() => {
                        handleClose();
                    }, 500);
                },
            }
        );
    }, [orderId, captureAction]);

    const handleCaptureCancel = useCallback(() => {
        setShowCaptureModal(false);
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
        method: (payment as PaymentSession).method || '',
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
        method: (payment as Transaction).method || '',
        order: {
            orderId: (payment as Transaction).id || '',
        },
    } : null;
    console.log('status', status);
    // Safety check: if no payment data, don't render
    if (!payment) {
        return null;
    }
    console.log('PaymentActionsModal payment', payment);
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
                            <BlurView
                                intensity={20}
                                tint="dark"
                                style={{ flex: 1 }}
                            >
                                <Pressable style={{ flex: 1 }} onPress={handleClose} />
                            </BlurView>
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
                                    {canRefundTransactions && canVoid && orderId && (
                                        <ActionItem
                                            icon={<XMarkIcon size={24} color="#D32F2F" />}
                                            title={t("Void")}
                                            onPress={handleVoidPress}
                                            isLoading={isVoiding}
                                            variant="danger"
                                        />
                                    )}
                                    {canRefundTransactions && canRefund && orderId && (
                                        <ActionItem
                                            icon={<ArrowUturnLeftIcon size={24} color="#D32F2F" />}
                                            title={t("Refund")}
                                            onPress={handleRefundPress}
                                            isLoading={isRefunding}
                                            variant="danger"
                                        />
                                    )}
                                    {canRefundTransactions && canCapture && orderId && (
                                        <ActionItem
                                            icon={<CheckCircleIcon size={24} color="#D32F2F" />}
                                            title={t("Capture")}
                                            onPress={handleCapturePress}
                                            isLoading={isCapturing}
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
                        title={t("Void Order")}
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
                            orderId={orderId || ''}
                        />
                    </ConfirmationModal>

                    <ConfirmationModal
                        isVisible={showCaptureModal}
                        onClose={handleCaptureCancel}
                        title={t("Capture Transaction")}
                    >
                        <CaptureConfirmation
                            order={orderForModal as any}
                            onConfirm={handleCaptureConfirm}
                            onCancel={handleCaptureCancel}
                            isCapturing={isCapturing}
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
                            transactionId={(payment as Transaction).transactionId || (payment as Transaction).id || ''}
                        />
                    </ConfirmationModal>

                    <ConfirmationModal
                        isVisible={showCaptureModal}
                        onClose={handleCaptureCancel}
                        title={t("Capture Transaction")}
                    >
                        <CaptureConfirmationTransaction
                            transaction={transactionForModal as any}
                            onConfirm={handleCaptureConfirm}
                            onCancel={handleCaptureCancel}
                            isCapturing={isCapturing}
                        />
                    </ConfirmationModal>
                </>
            )}
        </Modal>
    );
};

export default memo(PaymentActionsModal);
