import { useApi } from "@/src/core/api/clients.hooks"
import { useQuery } from "@tanstack/react-query"
import { getAccountStatistics, getDashboardStatistics, getTransfersStatistics } from "../balance.services"
import { AccountStatistics, DashboardStatisticsResponse, TransfersStatistics } from "../balance.model"
import { useAuthStore, selectUser } from "../../auth/auth.store"
import usePermissions from "../../auth/hooks/usePermissions"
import useHasFeature from "../../auth/hooks/useHasFeature";
import { useBalanceContext } from "../context/BalanceContext"

const useStatistics = () => {
    const { api } = useApi()
    const user = useAuthStore(selectUser)
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("multi accounts");
    console.log('hasBalanceFeature actions : ', user?.actions);
    console.log('hasBalanceFeature enabledFeatures : ', user?.enabledFeatures);

    const { activeAccount } = useBalanceContext();

    console.log('hasBalanceFeature activeAccount : ', activeAccount.accountId);
    const accountStatistics = useQuery<AccountStatistics>({
        queryKey: ["account-statistics", activeAccount.accountId],
        queryFn: () => getAccountStatistics(api, activeAccount.accountId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature),
    })

    const transfersStatistics = useQuery<TransfersStatistics>({
        queryKey: ["transfers-statistics", activeAccount.accountId],
        queryFn: () => getTransfersStatistics(api, activeAccount.accountId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature),
    })
    const dashboardStatistics = useQuery({
        queryKey: ["dashboard-statistics", activeAccount.accountId],
        queryFn: () => {
            // Get today's date range
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

            return getDashboardStatistics(api, {
                startDate: startOfDay.toISOString(),
                endDate: endOfDay.toISOString(),
                currency: 'EGP'
            });
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature),
        select: (data: DashboardStatisticsResponse) => {
            // Extract latest transaction and its method
            const latestTransaction = data.response.responseTransactions?.[0];
            const topMethod = latestTransaction?.method || '';

            // Flatten response structure
            return {
                currentStatistic: data.response.currentStatistic,
                latestTransaction: latestTransaction || null,
                topMethod
            };
        }
    })

    return {
        accountStatistics,
        transfersStatistics,
        dashboardStatistics
    }
}

export default useStatistics
