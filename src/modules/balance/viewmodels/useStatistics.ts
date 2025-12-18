import { useApi } from "@/src/core/api/clients.hooks"
import { useQuery } from "@tanstack/react-query"
import { selectUser, useAuthStore } from "../../auth/auth.store"
import useHasFeature from "../../auth/hooks/useHasFeature"
import usePermissions from "../../auth/hooks/usePermissions"
import { AccountStatistics, PaymentsStatistics, PayoutStatistics, TransfersStatistics } from "../balance.model"
import { getAccountStatistics, getPaymentsStatistics, getPayoutStatistics, getTransfersStatistics } from "../balance.services"
import { selectActiveAccountId, useBalanceStore } from "../balance.store"

type StatisticsDateFilters = { dateFrom?: string; dateTo?: string }

const useStatistics = (filters?: StatisticsDateFilters) => {
    const { api } = useApi()
    const user = useAuthStore(selectUser)
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("multi accounts");
    const activeAccountId = useBalanceStore(selectActiveAccountId);

    // const dateFrom = filters?.dateFrom
    // const dateTo = filters?.dateTo
    // const dateParams = {
    //     ...(dateFrom ? { dateFrom } : {}),
    //     ...(dateTo ? { dateTo } : {}),
    // }

    const normalizeToBackendDateTime = (value: string | undefined, isEnd: boolean) => {
        if (!value) return undefined;
        if (value.includes("T")) return value.endsWith("Z") ? value.slice(0, -1) : value;
        return isEnd ? `${value}T23:59:59.999` : `${value}T00:00:00.000`;
    };

    const dateFrom = normalizeToBackendDateTime(filters?.dateFrom, false);
    const dateTo = normalizeToBackendDateTime(filters?.dateTo, true);

    const dateParams = {
        ...(dateFrom ? { dateFrom } : {}),
        ...(dateTo ? { dateTo } : {}),
    };
    const accountStatistics = useQuery<AccountStatistics>({
        queryKey: ["account-statistics", activeAccountId],
        queryFn: () => getAccountStatistics(api, activeAccountId!),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature && activeAccountId),
    })

    const transfersStatistics = useQuery<TransfersStatistics>({
        queryKey: ["transfers-statistics", activeAccountId, dateFrom, dateTo],
        queryFn: () => getTransfersStatistics(api, activeAccountId!, dateParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature && activeAccountId),
    })
    const paymentsStatistics = useQuery<PaymentsStatistics>({
        queryKey: ["payments-statistics", activeAccountId, dateFrom, dateTo],
        queryFn: () => getPaymentsStatistics(api, activeAccountId!, dateParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature && activeAccountId),
    })
    const payoutStatistics = useQuery<PayoutStatistics>({
        queryKey: ["payout-statistics", activeAccountId, dateFrom, dateTo],
        queryFn: () => getPayoutStatistics(api, activeAccountId!, dateParams),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature && activeAccountId),
    })
    // const dashboardStatistics = useQuery({
    //     queryKey: ["dashboard-statistics", activeAccountId],
    //     queryFn: () => {
    //         // Get today's date range
    //         const today = new Date();
    //         const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    //         const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    //         return getDashboardStatistics(api, {
    //             startDate: startOfDay.toISOString(),
    //             endDate: endOfDay.toISOString(),
    //             currency: 'EGP'
    //         });
    //     },
    //     staleTime: 5 * 60 * 1000, // 5 minutes
    //     enabled: !!(canViewBalance && hasBalanceFeature && activeAccountId),
    //     select: (data: DashboardStatisticsResponse) => {
    //         // Extract latest transaction and its method
    //         const latestTransaction = data.response.responseTransactions?.[0];
    //         const topMethod = latestTransaction?.method || '';

    //         // Flatten response structure
    //         return {
    //             currentStatistic: data.response.currentStatistic,
    //             latestTransaction: latestTransaction || null,
    //             topMethod
    //         };
    //     }
    // })

    return {
        accountStatistics,
        transfersStatistics,
        // dashboardStatistics,
        paymentsStatistics,
        payoutStatistics
    }
}

export default useStatistics
