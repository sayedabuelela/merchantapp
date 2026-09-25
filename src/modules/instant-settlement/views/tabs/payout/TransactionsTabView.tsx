import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { GroupedRow, groupByDate } from "@/src/core/utils/groupData";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import PaymentLinkCardSkeleton from "@/src/modules/payment-links/components/PaymentLinkCardSkeleton";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { BanknotesIcon } from "react-native-heroicons/outline";
import type { EligibleTransaction } from "../../../domain/instant-settlement.models";
import { useInstantRequestTransactionsVM } from "../../../viewmodels/useInstantRequestTransactionsVM";
import TransactionRow from "../../components/TransactionRow";

interface Props {
    uuid: string;
}

/** Transactions tab — member txns (`/{uuid}/transactions`, paginated). */
const TransactionsTabView = ({ uuid }: Props) => {
    const { t } = useTranslation();

    const {
        transactions,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isRefetching,
        refetch,
    } = useInstantRequestTransactionsVM(uuid);

    const grouped = useMemo(() => groupByDate(transactions, 'createdAt'), [transactions]);
    const { listData, stickyHeaderIndices } = useGroupedData(transactions.length ? grouped : []);

    const renderItem = useCallback(
        ({ item }: { item: GroupedRow<EligibleTransaction> }) => {
            if (item.type === 'header') return <HeaderRow title={item.date} />;
            return <TransactionRow tx={item} />;
        },
        [],
    );

    if (isLoading) {
        return (
            <View className="flex-1 px-6 mt-6">
                <PaymentLinkCardSkeleton />
            </View>
        );
    }

    return (
        <View className="flex-1 px-6 mt-2">
            <StickyHeaderList<EligibleTransaction>
                listData={listData}
                stickyHeaderIndices={stickyHeaderIndices}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={renderItem}
                refreshing={isRefetching}
                onRefresh={refetch}
                keyExtractor={(item) => (item.type === 'header' ? `header-${item.date}` : item.id)}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <ActivityIndicator color="#001F5F" />
                        </View>
                    ) : undefined
                }
                ListEmptyComponent={
                    <EmptyDataList
                        icon={<BanknotesIcon size={48} color="#919C9C" />}
                        title={t('No transactions')}
                        description={t('No transactions for this request')}
                    />
                }
            />
        </View>
    );
};

export default TransactionsTabView;
