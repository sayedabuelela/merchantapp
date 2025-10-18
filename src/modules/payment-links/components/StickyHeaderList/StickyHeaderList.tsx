import { GroupedRow } from '@/src/core/utils/groupData';
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { PaymentLink } from '../../payment-links.model';

interface Props {
    listData: GroupedRow<PaymentLink>[];
    stickyHeaderIndices: number[];
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    handleShowCreatePLModal: () => void;
    ListEmptyComponent?: React.ReactElement;
    renderItem: (info: ListRenderItemInfo<GroupedRow<PaymentLink>>) => React.ReactElement;
}
export default function StickyHeaderList({ listData, stickyHeaderIndices, fetchNextPage, hasNextPage, isFetchingNextPage, ListEmptyComponent, renderItem }: Props) {
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
