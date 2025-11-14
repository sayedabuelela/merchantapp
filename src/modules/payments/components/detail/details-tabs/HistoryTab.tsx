import { View } from "react-native";
import { OrderDetailPayment } from "@/src/modules/payments/payments.model";
import { useTranslation } from "react-i18next";
import FontText from "@/src/shared/components/FontText";
import HistoryCard from "@/src/modules/payments/components/detail/HistoryCard";

interface Props {
    order: OrderDetailPayment;
}

const HistoryTab = ({ order }: Props) => {
    const { t } = useTranslation();

    const history = order.history || [];

    if (history.length === 0) {
        return (
            <View className="p-4 items-center justify-center">
                <FontText type="body" weight="regular" className="text-content-secondary text-sm">
                    {t('No history available')}
                </FontText>
            </View>
        );
    }

    return (
        <View className="mt-4">
            {history.map((item, index) => (
                <HistoryCard key={`${item.date}-${index}`} historyItem={item} />
            ))}
        </View>
    );
};

export default HistoryTab;
// This transaction was abandoned because the payment incomplete
