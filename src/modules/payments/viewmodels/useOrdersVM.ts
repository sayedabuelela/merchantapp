import { useApi } from "@/src/core/api/clients.hooks";
import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { groupByDate } from "@/src/core/utils/groupData";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FetchSessionsParams, FetchSessionsResponse } from "../payments.model";
import { fetchPaymentSessions } from "../payments.services";

interface OrdersInfinityResponse {
    pages: FetchSessionsResponse[];
    pageParams: number[];
}

export const useOrdersVM = (params?: FetchSessionsParams) => {
    const { api } = useApi();

    const ordersQuery = useInfiniteQuery<
        FetchSessionsResponse,
        Error,
        OrdersInfinityResponse,
        (string | FetchSessionsParams | undefined)[],
        number
    >({
        queryKey: ["payment-orders", params],
        queryFn: ({ pageParam = 1 }) =>
            fetchPaymentSessions(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const allItems = ordersQuery.data?.pages.flatMap((p) => p.data) ?? [];

    // Group orders by createdAt date
    const grouped = groupByDate(allItems, 'createdAt');
    const { listData, stickyHeaderIndices } = useGroupedData(allItems.length ? grouped : []);

    // Get stats from the first page
    const stats = ordersQuery.data?.pages[0]?.stats;

    return {
        ...ordersQuery,
        listData,
        stickyHeaderIndices,
        stats,
    };
};
