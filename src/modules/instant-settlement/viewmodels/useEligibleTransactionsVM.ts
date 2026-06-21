import { useApi } from '@/src/core/api/clients.hooks';
import { useGroupedData } from '@/src/core/hooks/useGroupedData';
import { groupByDate } from '@/src/core/utils/groupData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type {
    EligibleListResponseDTO,
    EligibleQueryParams,
} from '../dto/instant-settlement.dto';
import { fetchEligibleTransactions } from '../instant-settlement.services';
import {
    mapEligibleTransaction,
    mapEligibleSummary,
    mapLimits,
} from '../mappers/instant-settlement.mappers';
import type {
    EligibleTransaction,
    EligibleSummary,
    Limits,
} from '../domain/instant-settlement.models';

interface EligibleInfiniteData {
    pages: EligibleListResponseDTO[];
    pageParams: number[];
}

export const ELIGIBLE_QUERY_KEY = 'instant-eligible-transactions';

/**
 * Eligible transactions list (presentation models) + whole-set summary + real
 * limits. Grouped by transaction date for the sticky-header list.
 */
export const useEligibleTransactionsVM = (
    params?: EligibleQueryParams,
    enabled: boolean = true,
) => {
    const { api } = useApi();

    const query = useInfiniteQuery<
        EligibleListResponseDTO,
        Error,
        EligibleInfiniteData,
        (string | EligibleQueryParams | undefined)[],
        number
    >({
        queryKey: [ELIGIBLE_QUERY_KEY, params],
        queryFn: ({ pageParam = 1 }) =>
            fetchEligibleTransactions(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
        enabled,
    });

    const transactions: EligibleTransaction[] = useMemo(
        () =>
            query.data?.pages.flatMap((p) => p.data.map(mapEligibleTransaction)) ?? [],
        [query.data],
    );

    const summary: EligibleSummary | undefined = useMemo(() => {
        const dto = query.data?.pages[0]?.summary;
        return dto ? mapEligibleSummary(dto) : undefined;
    }, [query.data]);

    const limits: Limits | undefined = useMemo(() => {
        const dto = query.data?.pages[0]?.limits;
        return dto ? mapLimits(dto) : undefined;
    }, [query.data]);

    const grouped = useMemo(
        () => groupByDate(transactions, 'createdAt'),
        [transactions],
    );
    const { listData, stickyHeaderIndices } = useGroupedData(
        transactions.length ? grouped : [],
    );

    return {
        ...query,
        transactions,
        listData,
        stickyHeaderIndices,
        summary,
        limits,
        totalEligibleCount: summary?.count ?? transactions.length,
    };
};
