import React, { FC, useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { StatusBadge } from '../detail/StatusBadge';
import { formatRelativeDate, formatAMPM } from '@/src/core/utils/dateUtils';
import type { TransactionDetail } from '../../payments.model';
import { cn } from '@/src/core/utils/cn';
import Input from '@/src/shared/components/inputs/Input';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';

interface RefundConfirmationTransactionProps {
    transaction: TransactionDetail;
    onConfirm: (amount: number) => void;
    onCancel: () => void;
    isRefunding: boolean;
}

const RefundConfirmationTransaction: FC<RefundConfirmationTransactionProps> = ({
    transaction,
    onConfirm,
    onCancel,
    isRefunding,
}) => {
    const { t } = useTranslation();

    // Calculate max refundable amount
    const maxRefundableAmount = transaction.totalCapturedAmount - transaction.totalRefundedAmount;

    // State for refund amount (default to full refund)
    const [refundAmount, setRefundAmount] = useState<string>(maxRefundableAmount.toString());
    const [error, setError] = useState<string | null>(null);

    // Update refund amount when transaction data changes (after partial refund)
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
            {/* Transaction Summary */}
            <View className="mb-6">
                {/* Amount and Status */}
                <View className="flex-row items-center gap-x-2 mb-2">
                    <FontText type="head" weight="bold" className="text-content-primary text-xl">
                    {transaction.amount} {transaction.currency}
                    </FontText>
                    <StatusBox status={transaction.status} />
                </View>

                {/* Date and Time */}
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1">
                    {formatRelativeDate(transaction.date, false)} {formatAMPM(transaction.date)}
                </FontText>

                {/* Transaction ID */}
                <FontText type="body" weight="regular" className="text-content-secondary text-sm mb-1">
                    TX: {transaction.transactionId}
                </FontText>

                {/* Order ID */}
                {transaction.merchantOrderId && (
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                        {transaction.merchantOrderId}
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
                        {t('Max')}: {maxRefundableAmount} {transaction.currency}
                    </FontText>
                </View>

                {/* <View className={cn(
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
                </View> */}
                <Input
                    value={refundAmount}
                    onChangeText={setRefundAmount}
                    keyboardType="decimal-pad"
                    placeholder={t('Enter amount')}
                    placeholderTextColor="#94A3B8"
                    className="text-content-primary text-base"
                    error={!!error}
                    editable={!isRefunding}
                />

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

export default RefundConfirmationTransaction;
