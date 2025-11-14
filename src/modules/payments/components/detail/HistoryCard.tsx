import { View } from "react-native";
import { OrderDetailHistoryItem } from "@/src/modules/payments/payments.model";
import { useTranslation } from "react-i18next";
import FontText from "@/src/shared/components/FontText";
import { formatHistoryDate, getHistoryDescription } from "@/src/modules/payments/utils/history.utils";
import { getHistoryIcon } from "@/src/modules/payments/utils/history.icons";

interface HistoryCardProps {
    historyItem: OrderDetailHistoryItem;
}

const HistoryCard = ({ historyItem }: HistoryCardProps) => {
    const { t } = useTranslation();

    const description = getHistoryDescription(historyItem, t);
    const formattedDate = formatHistoryDate(historyItem.date);
    const { icon, backgroundColor } = getHistoryIcon(historyItem);

    // Build the header with date and optional transaction ID
    const header = historyItem.transactionId
        ? `${formattedDate} • ${historyItem.transactionId}`
        : formattedDate;

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

export default HistoryCard;
