import { useApi } from '@/src/core/api/clients.hooks';
import { useGroupedData } from '@/src/core/hooks/useGroupedData';
import { groupByDate } from '@/src/core/utils/groupData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type {
    RequestsListResponseDTO,
    RequestsQueryParams,
} from '../dto/instant-settlement.dto';
import { fetchInstantRequests } from '../instant-settlement.services';
import { mapRequestSummary } from '../mappers/instant-settlement.mappers';
import type { InstantRequestSummary } from '../domain/instant-settlement.models';

interface RequestsInfiniteData {
    pages: RequestsListResponseDTO[];
    pageParams: number[];
}

export const INSTANT_REQUESTS_QUERY_KEY = 'instant-requests';

/** Requests history list (presentation models) grouped by date. */
export const useInstantRequestsVM = (
    params?: RequestsQueryParams,
    enabled: boolean = true,
) => {
    const { api } = useApi();

    const query = useInfiniteQuery<
        RequestsListResponseDTO,
        Error,
        RequestsInfiniteData,
        (string | RequestsQueryParams | undefined)[],
        number
    >({
        queryKey: [INSTANT_REQUESTS_QUERY_KEY, params],
        queryFn: ({ pageParam = 1 }) =>
            fetchInstantRequests(api, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { page, pages } = lastPage.pagination;
            return page < pages ? page + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
        enabled,
    });

    const requests: InstantRequestSummary[] = useMemo(
        () => query.data?.pages.flatMap((p) => p.data.map(mapRequestSummary)) ?? [],
        [query.data],
    );

    const grouped = useMemo(() => groupByDate(requests, 'createdAt'), [requests]);
    const { listData, stickyHeaderIndices } = useGroupedData(
        requests.length ? grouped : [],
    );

    return {
        ...query,
        requests,
        listData,
        stickyHeaderIndices,
    };
};
