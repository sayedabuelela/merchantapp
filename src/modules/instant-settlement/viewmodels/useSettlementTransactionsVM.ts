import { useApi } from '@/src/core/api/clients.hooks';
import { useGroupedData } from '@/src/core/hooks/useGroupedData';
import { groupByDate } from '@/src/core/utils/groupData';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
    FetchSettlementTransactionsParams,
    FetchSettlementTransactionsResponse,
} from '../instant-settlement.model';
import { fetchSettlementTransactions } from '../instant-settlement.services';

interface SettlementTransactionsInfinityResponse {
    pages: FetchSettlementTransactionsResponse[];
    pageParams: number[];
}

export const useSettlementTransactionsVM = (params?: FetchSettlementTransactionsParams) => {
    const { api } = useApi();

    const transactionsQuery = useInfiniteQuery<
        FetchSettlementTransactionsResponse,
        Error,
        SettlementTransactionsInfinityResponse,
        (string | FetchSettlementTransactionsParams | undefined)[],
        number
    >({
        queryKey: ['settlement-transactions', params],
        queryFn: ({ pageParam = 1 }) =>
            fetchSettlementTransactions(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });
    console.log('transactionsQuery', transactionsQuery.data?.pages[0]?.summary);

    const allItems = transactionsQuery.data?.pages.flatMap((p) => p.body) ?? [];

    // Group transactions by settlementDate
    const grouped = groupByDate(allItems, 'lastModifiedDate');
    const { listData, stickyHeaderIndices } = useGroupedData(allItems.length ? grouped : []);

    return {
        ...transactionsQuery,
        listData,
        stickyHeaderIndices,
        instantSummary: transactionsQuery.data?.pages[0]?.summary,
    };
};
