import { GroupedRow } from '@/src/core/utils/groupData';
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
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
}

function StickyHeaderListComponent<T extends Record<string, any>>(
    { listData, stickyHeaderIndices, fetchNextPage, hasNextPage, isFetchingNextPage, ListEmptyComponent, ListHeaderComponent, renderItem }: Props<T>,
    ref: React.Ref<FlashList<GroupedRow<T>>>
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
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
        />
    )
}

const StickyHeaderList = forwardRef(StickyHeaderListComponent) as <T extends Record<string, any>>(
    props: Props<T> & { ref?: React.Ref<FlashList<GroupedRow<T>>> }
) => React.ReactElement;

export default StickyHeaderList;
