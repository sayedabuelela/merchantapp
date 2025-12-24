import { GroupedRow } from '@/src/core/utils/groupData';
import { FlashList, FlashListRef, ListRenderItemInfo } from "@shopify/flash-list";
import React, { forwardRef } from "react";

interface Props<T> {
    listData: GroupedRow<T>[];
    stickyHeaderIndices: number[];
    fetchNextPage: () => void;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    handleShowCreatePLModal?: () => void;
    ListEmptyComponent?: React.ReactElement;
    ListHeaderComponent?: React.ReactElement;
    renderItem: (info: ListRenderItemInfo<GroupedRow<T>>) => React.ReactElement;
    refreshing?: boolean;
    onRefresh?: () => void;
    onEndReachedThreshold?: number;
    ListFooterComponent?: React.ReactElement;
}

function StickyHeaderListComponent<T extends Record<string, any>>(
    { listData, stickyHeaderIndices, fetchNextPage, hasNextPage, isFetchingNextPage, ListEmptyComponent, ListHeaderComponent, renderItem, refreshing, onRefresh, onEndReachedThreshold, ListFooterComponent }: Props<T>,
    ref: React.Ref<FlashListRef<GroupedRow<T>>>
) {
    return (
        <FlashList
            ref={ref}
            // contentContainerClassName='gap-y-4'
            data={listData}
            stickyHeaderIndices={stickyHeaderIndices}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) =>
                item?.type === "header" ? `header-${item.date}` : item?._id
            }
            renderItem={renderItem}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={onEndReachedThreshold ?? 0.5}
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            refreshing={refreshing}
            onRefresh={onRefresh}
        />
    )
}

const StickyHeaderList = forwardRef(StickyHeaderListComponent) as <T extends Record<string, any>>(
    props: Props<T> & { ref?: React.Ref<FlashListRef<GroupedRow<T>>> }
) => React.ReactElement;

export default StickyHeaderList;
