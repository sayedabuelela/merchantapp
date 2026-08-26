import { View } from 'react-native';
import { currencyLabel } from '@/src/core/constants/currencies';
import { RelatedTransaction } from '@/src/modules/payments/payments.model';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { formatHistoryDate } from '@/src/modules/payments/utils/history.utils';
import { getTransactionHistoryIcon } from '@/src/modules/payments/utils/history.icons';
import { formatAmount } from '@/src/modules/payments/utils/formatters';

interface TransactionHistoryCardProps {
    historyItem: RelatedTransaction;
    errorMsg?: string;
}

const OPERATION_LABELS: Record<string, string> = {
    pay: 'payment',
    refund: 'refund',
};

const TransactionHistoryCard = ({ historyItem, errorMsg }: TransactionHistoryCardProps) => {
    const { t } = useTranslation();

    const formattedDate = formatHistoryDate(historyItem.date);
    const header = `${formattedDate} • ${historyItem.transactionId}`;

    const status = historyItem.status?.toUpperCase();
    const isFailure = status === 'FAILURE' || status === 'FAILED';
    const isSuccess = status === 'SUCCESS';

    const getDescription = () => {
        const operation = historyItem.operation?.toLowerCase();
        if (!operation) {
            return isFailure && errorMsg
                ? `${t('Transaction failed')}: ${errorMsg}`
                : t('Transaction');
        }

        const opLabel = t(OPERATION_LABELS[operation] || operation);
        const amount = formatAmount(historyItem.amount, currencyLabel(t, historyItem.currency));
        const fullName = historyItem.performedBy?.fullName;
        const byClause = fullName ? ` ${t('by')} ${fullName}` : '';
        return `${opLabel} ${amount}${byClause}`;
    };

    const { icon, backgroundColor } = getTransactionHistoryIcon(historyItem);
    const description = getDescription();

    return (
        <View className="flex-row items-start p-4 rounded border border-tertiary mb-2 gap-x-4">
            <View
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor }}
            >
                {icon}
            </View>

            <View className="flex-1">
                {(isSuccess || isFailure) && (
                    <View
                        className={`self-start px-2 py-0.5 rounded mb-2 ${
                            isFailure ? 'bg-feedback-error-bg' : 'bg-feedback-success-bg'
                        }`}
                    >
                        <FontText
                            type="body"
                            weight="medium"
                            className={`text-xs ${
                                isFailure ? 'text-feedback-error' : 'text-feedback-success-text'
                            }`}
                        >
                            {isFailure ? t('FAILED') : t('SUCCESSFUL')}
                        </FontText>
                    </View>
                )}
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
