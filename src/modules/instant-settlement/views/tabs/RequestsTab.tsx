import { cn } from "@/src/core/utils/cn";
import { GroupedRow } from "@/src/core/utils/groupData";
import AnimatedListItem from "@/src/shared/components/wrappers/animated-wrappers/AnimatedListItem";
import StickyHeaderList from "@/src/shared/components/StickyHeaderList";
import HeaderRow from "@/src/shared/components/StickyHeaderList/HeaderRow";
import EmptyDataList from "@/src/shared/components/empty-list/EmptyDataList";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";
import PaymentLinkCardSkeleton from "../../../payment-links/components/PaymentLinkCardSkeleton";
import type { RequestsQueryParams } from "../../dto/instant-settlement.dto";
import type { InstantRequestSummary } from "../../domain/instant-settlement.models";
import { useInstantRequestsVM } from "../../viewmodels/useInstantRequestsVM";
import RequestCard from "../components/RequestCard";

interface Props {
    params: RequestsQueryParams;
    enabled: boolean;
}

const RequestsTab = ({ params, enabled }: Props) => {
    const { t } = useTranslation();
    const listRef = useRef<React.ComponentRef<typeof FlashList<GroupedRow<InstantRequestSummary>>>>(null);

    const {
        listData,
        stickyHeaderIndices,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isRefetching,
        refetch,
    } = useInstantRequestsVM(params, enabled);

    const renderItem = useCallback(
        ({ item, index }: { item: GroupedRow<InstantRequestSummary>; index: number }) => {
            if (item.type === 'header') return <HeaderRow title={item.date} />;
            const itemsBefore = listData.slice(0, index).filter((i) => i.type !== 'header').length;
            return (
                <AnimatedListItem index={itemsBefore} delay={250} staggerDelay={40} duration={400}>
                    <RequestCard request={item} />
                </AnimatedListItem>
            );
        },
        [listData],
    );

    if (isLoading) {
        return (
            <View className={cn("flex-1 px-6 mt-3")}>
                <PaymentLinkCardSkeleton />
            </View>
        );
    }

    return (
        <View className={cn("flex-1 px-6")}>
            <StickyHeaderList
                ref={listRef}
                listData={listData}
                stickyHeaderIndices={stickyHeaderIndices}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={renderItem}
                refreshing={isRefetching}
                onRefresh={refetch}
                keyExtractor={(item) => (item.type === 'header' ? `header-${item.date}` : item.id)}
                ListEmptyComponent={
                    <EmptyDataList
                        icon={<ClockIcon size={48} color="#919C9C" />}
                        title={t('No requests')}
                        description={t('No instant settlement requests yet')}
                    />
                }
            />
        </View>
    );
};

export default RequestsTab;
