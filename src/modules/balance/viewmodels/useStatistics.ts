import { useApi } from "@/src/core/api/clients.hooks"
import { useQuery } from "@tanstack/react-query"
import { getAccountStatistics, getTransfersStatistics } from "../balance.services"
import { AccountStatistics, TransfersStatistics } from "../balance.model"
import { useAuthStore, selectUser } from "../../auth/auth.store"
import usePermissions from "../../auth/hooks/usePermissions"
import useHasFeature from "../../auth/hooks/useHasFeature";

const useStatistics = () => {
    const { api } = useApi()
    const user = useAuthStore(selectUser)
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("balance");

    const accountStatistics = useQuery<AccountStatistics>({
        queryKey: ["account-statistics"],
        queryFn: () => getAccountStatistics(api),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature),
    })

    const transfersStatistics = useQuery<TransfersStatistics>({
        queryKey: ["transfers-statistics"],
        queryFn: () => getTransfersStatistics(api),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature),
    })

    return {
        accountStatistics,
        transfersStatistics
    }
}

export default useStatistics
