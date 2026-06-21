import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { GroupedRow, groupByDate } from "@/src/core/utils/groupData";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { BuildingLibraryIcon } from "react-native-heroicons/outline";
import type { RequestRecord } from "../../../domain/instant-settlement.models";
import PayoutRecordRow from "../../components/PayoutRecordRow";

interface Props {
    records: RequestRecord[];
    recordsUnavailable: boolean;
}

/** Accounts tab — embedded `linkedBalanceRecords` (no pagination), grouped by date. */
const AccountsTabView = ({ records, recordsUnavailable }: Props) => {
    const { t } = useTranslation();

    const grouped = useMemo(() => groupByDate(records, 'createdAt'), [records]);
    const { listData, stickyHeaderIndices } = useGroupedData(records.length ? grouped : []);

    const renderItem = useCallback(
        ({ item }: { item: GroupedRow<RequestRecord> }) => {
            if (item.type === 'header') return <HeaderRow title={item.date} />;
            return <PayoutRecordRow record={item} />;
        },
        [],
    );

    if (recordsUnavailable) {
        return (
            <View className="flex-1 px-6 mt-6">
                <EmptyDataList
                    icon={<BuildingLibraryIcon size={48} color="#919C9C" />}
                    title={t('Unavailable')}
                    description={t('Records are currently unavailable')}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 px-6 mt-6">
            <StickyHeaderList<RequestRecord>
                listData={listData}
                stickyHeaderIndices={stickyHeaderIndices}
                fetchNextPage={() => {}}
                hasNextPage={false}
                isFetchingNextPage={false}
                renderItem={renderItem}
                keyExtractor={(item) => (item.type === 'header' ? `header-${item.date}` : item.id)}
                ListEmptyComponent={
                    <EmptyDataList
                        icon={<BuildingLibraryIcon size={48} color="#919C9C" />}
                        title={t('No records')}
                        description={t('No account records for this request')}
                    />
                }
            />
        </View>
    );
};

export default AccountsTabView;
