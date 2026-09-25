import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { GroupedRow, groupByDate } from "@/src/core/utils/groupData";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { BanknotesIcon } from "react-native-heroicons/outline";
import type { EligibleTransaction } from "../../../domain/instant-settlement.models";
import TransactionRow from "../../components/TransactionRow";

interface Props {
    transactions: EligibleTransaction[];
}

/**
 * Excluded tab — transactions an agent removed from the request (FIN-20275).
 * Data is embedded in the details response (`unselectedTransactions`), so
 * there is no fetching or pagination here.
 */
const ExcludedTabView = ({ transactions }: Props) => {
    const { t } = useTranslation();

    const grouped = useMemo(() => groupByDate(transactions, 'createdAt'), [transactions]);
    const { listData, stickyHeaderIndices } = useGroupedData(transactions.length ? grouped : []);

    const renderItem = useCallback(
        ({ item }: { item: GroupedRow<EligibleTransaction> }) => {
            if (item.type === 'header') return <HeaderRow title={item.date} />;
            return <TransactionRow tx={item} />;
        },
        [],
    );

    return (
        <View className="flex-1 px-6 mt-2">
            <StickyHeaderList<EligibleTransaction>
                listData={listData}
                stickyHeaderIndices={stickyHeaderIndices}
                fetchNextPage={() => {}}
                hasNextPage={false}
                isFetchingNextPage={false}
                renderItem={renderItem}
                keyExtractor={(item) => (item.type === 'header' ? `header-${item.date}` : item.id)}
                ListEmptyComponent={
                    <EmptyDataList
                        icon={<BanknotesIcon size={48} color="#919C9C" />}
                        title={t('No transactions')}
                        description={t('No excluded transactions for this request')}
                    />
                }
            />
        </View>
    );
};

export default ExcludedTabView;
