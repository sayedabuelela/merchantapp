import React, { FC, useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { StatusBadge } from '../detail/StatusBadge';
import { formatRelativeDate, formatAMPM } from '@/src/core/utils/dateUtils';
import type { OrderDetailPayment } from '../../payments.model';
import { cn } from '@/src/core/utils/cn';

interface RefundConfirmationProps {
    order: OrderDetailPayment;
    onConfirm: (amount: number) => void;
    onCancel: () => void;
    isRefunding: boolean;
}

const RefundConfirmation: FC<RefundConfirmationProps> = ({
    order,
    onConfirm,
    onCancel,
    isRefunding,
}) => {
    const { t } = useTranslation();

    // Calculate max refundable amount
    const maxRefundableAmount = order.capturedAmount - order.refundedAmount;

    // State for refund amount (default to full refund)
    const [refundAmount, setRefundAmount] = useState<string>(maxRefundableAmount.toString());
    const [error, setError] = useState<string | null>(null);

    // Update refund amount when order data changes (after partial refund)
    useEffect(() => {
        setRefundAmount(maxRefundableAmount.toString());
    }, [maxRefundableAmount]);

    // Validate refund amount
    useEffect(() => {
        const amount = parseFloat(refundAmount);

        if (isNaN(amount) || refundAmount.trim() === '') {
            setError(t('Please enter a valid amount'));
            return;
        }

        if (amount <= 0) {
            setError(t('Amount must be greater than 0'));
            return;
        }

        if (amount > maxRefundableAmount) {
            setError(t('Amount exceeds maximum refundable amount'));
            return;
        }

        setError(null);
    }, [refundAmount, maxRefundableAmount, t]);

    const handleConfirm = () => {
        const amount = parseFloat(refundAmount);
        if (!error && !isNaN(amount) && amount > 0 && amount <= maxRefundableAmount) {
            onConfirm(amount);
        }
    };

    const isConfirmDisabled = !!error || isRefunding || !refundAmount;

    return (
        <View>
            {/* Payment Summary */}
            <View className="mb-6">
                {/* Amount and Status */}
                <View className="flex-row items-center justify-between mb-3">
                    <FontText type="head" weight="bold" className="text-content-primary text-2xl">
                        {order.amount} {order.currency}
                    </FontText>
                    <StatusBadge status={order.status} type="order" />
                </View>

                {/* Date and Time */}
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1">
                    {formatRelativeDate(order.createdAt, false)} {formatAMPM(order.createdAt)}
                </FontText>

                {/* Order ID */}
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1">
                    {order.orderId}
                </FontText>

                {/* Transaction ID */}
                {order.targetTransactionId && (
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                        TX: {order.targetTransactionId}
                    </FontText>
                )}
            </View>

            {/* Confirmation Message */}
            <FontText type="body" weight="regular" className="text-content-secondary text-base mb-4">
                {t("Are you sure you want to refund this transaction?")}
            </FontText>

            {/* Refund Amount Input */}
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                    <FontText type="body" weight="medium" className="text-content-primary text-sm">
                        {t('Refund Amount')}
                    </FontText>
                    <FontText type="body" weight="regular" className="text-content-tertiary text-xs">
                        {t('Max')}: {maxRefundableAmount} {order.currency}
                    </FontText>
                </View>

                <View className={cn(
                    'border rounded-lg px-4 py-3 bg-surface-primary',
                    error ? 'border-feedback-error' : 'border-stroke-divider'
                )}>
                    <TextInput
                        value={refundAmount}
                        onChangeText={setRefundAmount}
                        keyboardType="decimal-pad"
                        placeholder={t('Enter amount')}
                        placeholderTextColor="#94A3B8"
                        className="text-content-primary text-base"
                        editable={!isRefunding}
                    />
                </View>

                {error && (
                    <FontText type="body" weight="regular" className="text-feedback-error text-xs mt-1">
                        {error}
                    </FontText>
                )}
            </View>

            {/* Action Buttons */}
            <View className="gap-y-4">
                <Button
                    disabled={isConfirmDisabled}
                    isLoading={isRefunding}
                    title={t('Confirm refund')}
                    variant="danger"
                    onPress={handleConfirm}
                />
                <Button
                    className="border-0"
                    title={t('Cancel')}
                    variant="outline"
                    onPress={onCancel}
                    disabled={isRefunding}
                />
            </View>
        </View>
    );
};

export default RefundConfirmation;
