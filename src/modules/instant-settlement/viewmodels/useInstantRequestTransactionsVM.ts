import { useApi } from '@/src/core/api/clients.hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { MemberTransactionsResponseDTO } from '../dto/instant-settlement.dto';
import { fetchInstantRequestTransactions } from '../instant-settlement.services';
import { mapEligibleTransaction } from '../mappers/instant-settlement.mappers';
import type { EligibleTransaction } from '../domain/instant-settlement.models';

interface MemberInfiniteData {
    pages: MemberTransactionsResponseDTO[];
    pageParams: number[];
}

/**
 * Member transactions for a request (`/{uuid}/transactions`, paginated).
 * Backs the payout-details "Transactions" list with a "Load more" pattern.
 */
export const useInstantRequestTransactionsVM = (uuid: string, enabled = true) => {
    const { api } = useApi();

    const query = useInfiniteQuery<
        MemberTransactionsResponseDTO,
        Error,
        MemberInfiniteData,
        (string | undefined)[],
        number
    >({
        queryKey: ['instant-request-transactions', uuid],
        queryFn: ({ pageParam = 1 }) =>
            fetchInstantRequestTransactions(api, uuid, { page: pageParam, limit: 20, selection: 'SELECTED' }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: enabled && !!uuid,
        staleTime: 5 * 60 * 1000,
    });

    const transactions: EligibleTransaction[] = useMemo(
        () => query.data?.pages.flatMap((p) => p.data.map(mapEligibleTransaction)) ?? [],
        [query.data],
    );

    return {
        ...query,
        transactions,
    };
};
