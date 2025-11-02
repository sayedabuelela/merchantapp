import { GroupedRow } from '@/src/core/utils/groupData';
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";

interface Props<T> {
    listData: GroupedRow<T>[];
    stickyHeaderIndices: number[];
    fetchNextPage: () => void;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    handleShowCreatePLModal?: () => void;
    ListEmptyComponent?: React.ReactElement;
    renderItem: (info: ListRenderItemInfo<GroupedRow<T>>) => React.ReactElement;
}
export default function StickyHeaderList<T extends Record<string, any>>({ listData, stickyHeaderIndices, fetchNextPage, hasNextPage, isFetchingNextPage, ListEmptyComponent, renderItem }: Props<T>) {
    return (
        <FlashList
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
        />
    )
}
