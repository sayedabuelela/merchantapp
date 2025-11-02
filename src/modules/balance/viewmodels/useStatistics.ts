import { useApi } from "@/src/core/api/clients.hooks"
import { useQuery } from "@tanstack/react-query"
import { getAccountStatistics, getTransfersStatistics } from "../balance.services"
import { AccountStatistics, TransfersStatistics } from "../balance.model"
import { useAuthStore, selectUser } from "../../auth/auth.store"
import usePermissions from "../../auth/hooks/usePermissions"
import useHasFeature from "../../auth/hooks/useHasFeature";
import { useBalanceContext } from "../context/BalanceContext"

const useStatistics = () => {
    const { api } = useApi()
    const user = useAuthStore(selectUser)
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("multi accounts");
    const { activeAccount } = useBalanceContext();

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

    return {
        accountStatistics,
        transfersStatistics
    }
}

export default useStatistics
