import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/src/core/api/clients.hooks';
import { fetchTransactionDetail } from '../payments.services';
import { FetchTransactionDetailResponse } from '../payments.model';

/**
 * ViewModel hook for fetching transaction detail
 * @param transactionId - The transaction ID
 * @returns React Query result with transaction detail data
 */
export const useTransactionDetailVM = (transactionId: string) => {
    const { api } = useApi();

    const transactionDetailQuery = useQuery<FetchTransactionDetailResponse>({
        queryKey: ['payment-transaction-detail', transactionId],
        queryFn: () => fetchTransactionDetail(api, transactionId),
        enabled: !!transactionId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        ...transactionDetailQuery,
        transaction: transactionDetailQuery.data?.body,
    };
};
