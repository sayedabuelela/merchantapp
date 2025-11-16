import React, { FC } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import Button from '@/src/shared/components/Buttons/Button';
import { StatusBadge } from '../detail/StatusBadge';
import { formatRelativeDate } from '@/src/core/utils/dateUtils';
import { formatAMPM } from '@/src/core/utils/dateUtils';
import type { OrderDetailPayment } from '../../payments.model';

interface VoidConfirmationProps {
    order: OrderDetailPayment;
    onConfirm: () => void;
    onCancel: () => void;
    isVoiding: boolean;
}

const VoidConfirmation: FC<VoidConfirmationProps> = ({
    order,
    onConfirm,
    onCancel,
    isVoiding,
}) => {
    const { t } = useTranslation();

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
            <FontText type="body" weight="regular" className="text-content-secondary text-base mb-6">
                {t("Are you sure you want to void this transaction?")}
            </FontText>

            {/* Action Buttons */}
            <View className="gap-y-4">
                <Button
                    disabled={isVoiding}
                    isLoading={isVoiding}
                    title={t('Confirm transaction void')}
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

export default VoidConfirmation;
