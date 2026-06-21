import { formatAMPM, formatRelativeDate } from "@/src/core/utils/dateUtils";
import StatusBox from "@/src/modules/payment-links/components/StatusBox";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import FontText from "@/src/shared/components/FontText";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";
import type { RequestStatusHistoryEntry } from "../../../domain/instant-settlement.models";

interface Props {
    statusHistory: RequestStatusHistoryEntry[];
}

/** History tab — `statusHistory[]` timeline (HistoryCard visual pattern). */
const HistoryTabView = ({ statusHistory }: Props) => {
    const { t } = useTranslation();

    if (statusHistory.length === 0) {
        return (
            <View className="flex-1 px-6 mt-6">
                <EmptyDataList
                    icon={<ClockIcon size={48} color="#919C9C" />}
                    title={t('No history')}
                    description={t('No status history for this request')}
                />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 pt-6 pb-10"
            showsVerticalScrollIndicator={false}
        >
            {statusHistory.map((entry, index) => (
                <View
                    key={`${entry.status}-${entry.at}-${index}`}
                    className="flex-row items-start p-4 rounded border border-tertiary mb-2 gap-x-4"
                >
                    <View className="w-8 h-8 rounded-full items-center justify-center bg-[#F5F6F6]">
                        <ClockIcon size={16} color="#556767" />
                    </View>
                    <View className="flex-1">
                        <FontText type="body" weight="regular" className="text-sm text-content-secondary self-start mb-2">
                            {formatRelativeDate(entry.at)}, {formatAMPM(entry.at)}
                        </FontText>
                        <StatusBox status={entry.status} />
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

export default HistoryTabView;
