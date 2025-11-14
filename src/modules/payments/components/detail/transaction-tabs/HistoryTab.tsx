import { View } from 'react-native';
import { TransactionDetail } from '@/src/modules/payments/payments.model';
import { useTranslation } from 'react-i18next';
import FontText from '@/src/shared/components/FontText';
import TransactionHistoryCard from '@/src/modules/payments/components/detail/TransactionHistoryCard';

interface Props {
    transaction: TransactionDetail;
}

const HistoryTab = ({ transaction }: Props) => {
    const { t } = useTranslation();

    const history = transaction.transactions || [];

    if (history.length === 0) {
        return (
            <View className="p-4 items-center justify-center">
                <FontText
                    type="body"
                    weight="regular"
                    className="text-content-secondary text-sm"
                >
                    {t('No history available')}
                </FontText>
            </View>
        );
    }

    return (
        <View className="mt-4">
            {history.map((item, index) => (
                <TransactionHistoryCard key={`${item.date}-${index}`} historyItem={item} />
            ))}
        </View>
    );
};

export default HistoryTab;
