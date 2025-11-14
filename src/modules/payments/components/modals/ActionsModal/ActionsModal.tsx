import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { Bars3BottomLeftIcon } from 'react-native-heroicons/outline';

import FontText from '@/src/shared/components/FontText';
import ActionItem from './ActionItem';
import { PaymentSession, Transaction } from '../../../payments.model';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';
import { currencyNumber } from '@/src/core/utils/number-fields';
import { formatAMPM, formatRelativeDate } from '@/src/core/utils/dateUtils';
import { useTranslation } from 'react-i18next';

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
    const router = useRouter();

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

    // Build display data with safety checks
    const amount = isTransaction(payment)
        ? `${currencyNumber(payment?.amount ?? 0)} ${t(payment?.currency || 'EGP')}`
        : `${currencyNumber(payment?.paymentParams?.amount ?? 0)} ${t(payment?.paymentParams?.currency || 'EGP')}`;

    const status = payment?.status || '';

    const date = payment?.createdAt ? formatRelativeDate(payment.createdAt) : '';
    const time = payment?.createdAt ? formatAMPM(payment.createdAt) : '';

    const orderId = isTransaction(payment)
        ? payment?.merchantOrderId || ''
        : payment?.paymentParams?.order || '';

    const transactionId = isTransaction(payment)
        ? payment?.transactionId || ''
        : payment?.targetTransactionId || '';

    // Build subtitle parts
    const subtitleParts = [];
    if (date && time) subtitleParts.push(`${date}, ${time}`);
    if (orderId) subtitleParts.push(orderId);
    if (transactionId) subtitleParts.push(transactionId);
    const subtitle = subtitleParts.join(' • ');

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
                                </View>
                            </MotiView>
                        </TouchableWithoutFeedback>
                    </View>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default memo(PaymentActionsModal);
