import React, { FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { StatusBadge } from '../detail/StatusBadge';
import { formatRelativeDate, formatAMPM } from '@/src/core/utils/dateUtils';
import type { TransactionDetail } from '../../payments.model';
import StatusBox from '@/src/modules/payment-links/components/StatusBox';

interface VoidConfirmationTransactionProps {
    transaction: TransactionDetail;
    onConfirm: () => void;
    onCancel: () => void;
    isVoiding: boolean;
}

const VoidConfirmationTransaction: FC<VoidConfirmationTransactionProps> = ({
    transaction,
    onConfirm,
    onCancel,
    isVoiding,
}) => {
    const { t } = useTranslation();

    return (
        <View>
            {/* Transaction Summary */}
            <View className="mb-6">
                {/* Amount and Status */}
                {/* <View className="flex-row items-center justify-between mb-3">
                    <FontText type="head" weight="bold" className="text-content-primary text-2xl">
                        {transaction.amount} {transaction.currency}
                    </FontText>
                    <StatusBadge status={transaction.status} type="transaction" />
                </View> */}
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
            <FontText type="body" weight="regular" className="text-content-secondary text-base mb-6">
                {t("Are you sure you want to void this transaction?")}
            </FontText>

            {/* Action Buttons */}
            <View className="gap-y-4">
                <Button
                    disabled={isVoiding}
                    isLoading={isVoiding}
                    title={t('Confirm')}
                    variant="danger"
                    onPress={onConfirm}
                />
                <Button
                    className="border-0"
                    title={t('Cancel')}
                    variant="outline"
                    onPress={onCancel}
                    disabled={isVoiding}
                />
            </View>
        </View>
    );
};

export default VoidConfirmationTransaction;
