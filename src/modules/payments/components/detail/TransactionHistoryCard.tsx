import { View } from 'react-native';
import { RelatedTransaction } from '@/src/modules/payments/payments.model';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import { formatHistoryDate } from '@/src/modules/payments/utils/history.utils';
import { CheckIcon, XMarkIcon, BanknotesIcon } from 'react-native-heroicons/outline';
import { RefundSettlementIcon } from '@/src/shared/assets/svgs';

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
            return t('Successful payment');
        } else if (operation === 'refund' && status === 'SUCCESS') {
            return `${t('Successfully refunded')} ${amount} ${currency}`;
        } else if (status === 'FAILURE' || status === 'FAILED') {
            return t('Transaction failed');
        } else {
            return `${t(operation || 'Transaction')} - ${t(status)}`;
        }
    };

    // Get icon and background color based on status and operation
    // Uses EXACT same icons and colors as order history (history.icons.tsx)
    const getIconAndColor = () => {
        const operation = historyItem.operation?.toLowerCase();
        const status = historyItem.status;

        // Color constants (matching history.icons.tsx)
        const COLORS = {
            SUCCESS: '#4AAB4E',
            FAILURE: '#A50017',
            NEUTRAL: '#D5D9D9',
            ICON_GRAY: '#556767',
            ICON_WHITE: '#fff',
        };

        // 1. Handle refund operations first (always show refund icon)
        if (operation === 'refund') {
            return {
                icon: <RefundSettlementIcon />,
                backgroundColor: COLORS.NEUTRAL,
            };
        }

        // 2. Handle main payment success (pay operation with SUCCESS status)
        if (operation === 'pay' && status === 'SUCCESS') {
            return {
                icon: <CheckIcon size={16} color={COLORS.ICON_WHITE} />,
                backgroundColor: COLORS.SUCCESS,
            };
        }

        // 3. Handle FAILURE/FAILED status (for any operation)
        if (status === 'FAILURE' || status === 'FAILED') {
            return {
                icon: <XMarkIcon size={16} color={COLORS.ICON_WHITE} />,
                backgroundColor: COLORS.FAILURE,
            };
        }

        // 4. Default fallback
        return {
            icon: <BanknotesIcon size={16} color={COLORS.ICON_GRAY} />,
            backgroundColor: COLORS.NEUTRAL,
        };
    };

    const { icon, backgroundColor } = getIconAndColor();
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
