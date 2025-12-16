import React, { FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { StatusBadge } from '../detail/StatusBadge';
import { formatRelativeDate, formatAMPM } from '@/src/core/utils/dateUtils';
import type { TransactionDetail } from '../../payments.model';

interface CaptureConfirmationTransactionProps {
    transaction: TransactionDetail;
    onConfirm: () => void;
    onCancel: () => void;
    isCapturing: boolean;
}

const CaptureConfirmationTransaction: FC<CaptureConfirmationTransactionProps> = ({
    transaction,
    onConfirm,
    onCancel,
    isCapturing,
}) => {
    const { t } = useTranslation();

    return (
        <View>
            {/* Transaction Summary */}
            <View className="mb-6">
                {/* Amount and Status */}
                <View className="flex-row items-center justify-between mb-3">
                    <FontText type="head" weight="bold" className="text-content-primary text-2xl">
                        {transaction.amount} {transaction.currency}
                    </FontText>
                    <StatusBadge status={transaction.status} type="transaction" />
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
                {transaction.order?.orderId && (
                    <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                        {transaction.order.orderId}
                    </FontText>
                )}
            </View>

            {/* Confirmation Message */}
            <FontText type="body" weight="regular" className="text-content-secondary text-base mb-6">
                {t("Are you sure you want to capture this authorized transaction?")}
            </FontText>

            {/* Action Buttons */}
            <View className="gap-y-4">
                <Button
                    disabled={isCapturing}
                    isLoading={isCapturing}
                    title={t('Confirm capture')}
                    variant="primary"
                    onPress={onConfirm}
                />
                <Button
                    className="border-0"
                    title={t('Cancel')}
                    variant="outline"
                    onPress={onCancel}
                    disabled={isCapturing}
                />
            </View>
        </View>
    );
};

export default CaptureConfirmationTransaction;
