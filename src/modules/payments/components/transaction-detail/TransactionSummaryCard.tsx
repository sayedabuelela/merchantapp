import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { DetailSection, DetailRow, StatusBadge, AmountDisplay } from '../detail';
import { TransactionDetail } from '../../payments.model';
import { formatAMPM } from '@/src/core/utils/dateUtils';

interface TransactionSummaryCardProps {
    transaction: TransactionDetail;
}

/**
 * Main transaction summary card displaying key transaction information
 */
export const TransactionSummaryCard = ({ transaction }: TransactionSummaryCardProps) => {
    const { t } = useTranslation();

    return (
        <DetailSection>
            <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                    <AmountDisplay
                        amount={transaction.amount}
                        currency={transaction.currency}
                        size="large"
                    />
                </View>
                <StatusBadge status={transaction.status} type="transaction" />
            </View>

            <View className="border-t border-tertiary pt-3">
                <DetailRow label={t('Transaction ID')} value={transaction.transactionId} />
                <DetailRow label={t('Type')} value={transaction.trxType} />
                <DetailRow label={t('Status')} value={transaction.status} />
                <DetailRow label={t('Payment Status')} value={transaction.paymentStatus} />
                <DetailRow label={t('Transaction Date')} value={formatAMPM(transaction.date)} />
                {transaction.merchantOrderId && (
                    <DetailRow label={t('Merchant Order ID')} value={transaction.merchantOrderId} />
                )}
                {transaction.totalCapturedAmount > 0 && (
                    <DetailRow
                        label={t('Captured Amount')}
                        value={`${transaction.totalCapturedAmount} ${transaction.currency}`}
                        valueColor="text-green-700"
                    />
                )}
                {transaction.totalRefundedAmount > 0 && (
                    <DetailRow
                        label={t('Refunded Amount')}
                        value={`${transaction.totalRefundedAmount} ${transaction.currency}`}
                        valueColor="text-purple-700"
                    />
                )}
            </View>
        </DetailSection>
    );
};
