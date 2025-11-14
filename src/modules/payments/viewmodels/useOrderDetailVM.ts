import { useQuery } from '@tanstack/react-query';
import { fetchOrderDetail } from '../payments.services';
import { FetchOrderDetailResponse } from '../payments.model';
import { useApi } from '@/src/core/api/clients.hooks';

/**
 * ViewModel hook for fetching order detail
 * @param sessionId - The payment session _id
 * @returns React Query result with order detail data
 */
export const useOrderDetailVM = (sessionId: string) => {
    const { api } = useApi();

    const orderDetailQuery = useQuery<FetchOrderDetailResponse>({
        queryKey: ['payment-order-detail', sessionId],
        queryFn: () => fetchOrderDetail(api, sessionId),
        enabled: !!sessionId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        ...orderDetailQuery,
        order: orderDetailQuery.data?.data,
    };
};
