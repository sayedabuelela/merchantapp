import { useApi } from "@/src/core/api/clients.hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Transaction } from "../../payments/payments.model";
import { ActivityRecord, PayoutBatchResponse, PayoutWindowParams, SettlementResponse, SettlementWindowParams, TransactionRecord } from "../balance.model";
import { getSettlementWindow, getPayoutBatches } from "../balance.services";

const BATCH_LIMIT = 3;

export const useSettlementWindow = (params: SettlementWindowParams, options?: any) => {
    const { api } = useApi();

    return useInfiniteQuery<SettlementResponse, Error, Transaction[], string[], number>({
        queryKey: ["settlement-window", params.originReference],
        queryFn: ({ pageParam = 1 }) => getSettlementWindow(api, { ...params, limit: BATCH_LIMIT, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage.transactions?.pagination;
            if (!pagination) return undefined;
            const hasMore = pagination.page < pagination.pages;
            return hasMore ? pagination.page + 1 : undefined;
        },
        select: (data) => data.pages.flatMap(page => page.transactions?.data || []),
        ...options
    });
};

export const usePayoutBatches = (activityId: string, params: PayoutWindowParams, options?: any) => {
    const { api } = useApi();

    return useInfiniteQuery<PayoutBatchResponse, Error, (ActivityRecord | TransactionRecord)[], string[], number>({
        queryKey: ["payout-batches", activityId],
        queryFn: ({ pageParam = 1 }) => getPayoutBatches(api, activityId, { ...params, limit: BATCH_LIMIT, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return lastPage.pagination.currentPage + 1;
            }
            return undefined;
        },
        select: (data) => data.pages.flatMap(page => page.data || []),
        ...options
    });
};
