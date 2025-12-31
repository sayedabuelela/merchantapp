import { View } from 'react-native';
import { RelatedTransaction } from '@/src/modules/payments/payments.model';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { formatHistoryDate } from '@/src/modules/payments/utils/history.utils';
import { getTransactionHistoryIcon } from '@/src/modules/payments/utils/history.icons';

interface TransactionHistoryCardProps {
    historyItem: RelatedTransaction;
}

const TransactionHistoryCard = ({ historyItem }: TransactionHistoryCardProps) => {
    const { t } = useTranslation();

    // Format date
    const formattedDate = formatHistoryDate(historyItem.date);

    // Build the header with date and transaction ID
    const header = `${formattedDate} • ${historyItem.transactionId}`;

    // Get description based on operation and status
    const getDescription = () => {
        const operation = historyItem.operation?.toLowerCase();
        const status = historyItem.status;
        const amount = historyItem.amount;
        const currency = historyItem.currency;

        if (operation === 'pay' && status === 'SUCCESS') {
            return `${t('Successful payment')} ${amount} ${currency}`;
        } else if (operation === 'refund' && status === 'SUCCESS') {
            return `${t('Successfully refunded')} ${amount} ${currency}`;
        } else if (status === 'FAILURE' || status === 'FAILED') {
            return t('Transaction failed');
        } else {
            return `${t(operation || 'Transaction')} - ${t(status)}`;
        }
    };

    // Get icon and background color using shared utility
    const { icon, backgroundColor } = getTransactionHistoryIcon(historyItem);
    const description = getDescription();

    return (
        <View className="flex-row items-start p-4 rounded border border-tertiary mb-2 gap-x-4">
            {/* Status icon */}
            <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor }}
            >
                {icon}
            </View>

            {/* Content */}
            <View className="flex-1">
                <FontText
                    type="body"
                    weight="regular"
                    className="text-sm text-content-secondary self-start mb-1"
                >
                    {header}
                </FontText>
                <FontText
                    type="body"
                    weight="regular"
                    className="text-sm text-content-primary self-start"
                >
                    {description}
                </FontText>
            </View>
        </View>
    );
};

export default TransactionHistoryCard;
