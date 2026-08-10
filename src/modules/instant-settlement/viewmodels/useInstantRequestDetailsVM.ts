import { useApi } from '@/src/core/api/clients.hooks';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchInstantRequestDetails } from '../instant-settlement.services';
import { mapRequestDetails } from '../mappers/instant-settlement.mappers';
import type { InstantRequestDetails } from '../domain/instant-settlement.models';

/**
 * Request details (`useQuery /{uuid}`). Feeds three of the four payout-details
 * tabs — Details, Accounts (`details.records` from embedded `linkedBalanceRecords`,
 * no pagination), and History (`details.statusHistory`). The Transactions tab is
 * fed by a separate paginated query (`useInstantRequestTransactionsVM`).
 */
export const useInstantRequestDetailsVM = (uuid: string, enabled = true) => {
    const { api } = useApi();

    const query = useQuery({
        queryKey: ['instant-request-details', uuid],
        queryFn: () => fetchInstantRequestDetails(api, uuid),
        enabled: enabled && !!uuid,
        staleTime: 0,
        refetchOnMount: 'always',
    });

    const details: InstantRequestDetails | undefined = useMemo(
        () => (query.data ? mapRequestDetails(query.data) : undefined),
        [query.data],
    );

    return {
        ...query,
        details,
    };
};
