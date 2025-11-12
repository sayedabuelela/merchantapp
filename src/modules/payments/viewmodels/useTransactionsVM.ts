import { useApi } from "@/src/core/api/clients.hooks";
import { useGroupedData } from "@/src/core/hooks/useGroupedData";
import { groupByDate } from "@/src/core/utils/groupData";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FetchTransactionsParams, FetchTransactionsResponse } from "../payments.model";
import { fetchTransactions } from "../payments.services";

interface TransactionsInfinityResponse {
    pages: FetchTransactionsResponse[];
    pageParams: number[];
}

export const useTransactionsVM = (params?: FetchTransactionsParams) => {
    const { api } = useApi();

    const transactionsQuery = useInfiniteQuery<
        FetchTransactionsResponse,
        Error,
        TransactionsInfinityResponse,
        (string | FetchTransactionsParams | undefined)[],
        number
    >({
        queryKey: ["payment-transactions", params],
        queryFn: ({ pageParam = 1 }) =>
            fetchTransactions(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const allItems = transactionsQuery.data?.pages.flatMap((p) => p.body) ?? [];

    // Group transactions by createdAt date
    const grouped = groupByDate(allItems, 'createdAt');
    const { listData, stickyHeaderIndices } = useGroupedData(allItems.length ? grouped : []);

    return {
        ...transactionsQuery,
        listData,
        stickyHeaderIndices,
    };
};
