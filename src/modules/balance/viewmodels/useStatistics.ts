import { useApi } from "@/src/core/api/clients.hooks"
import { useQuery } from "@tanstack/react-query"
import { getAccountStatistics, getTransfersStatistics } from "../balance.services"
import { AccountStatistics, TransfersStatistics } from "../balance.model"

const useStatistics = () => {
    const { api } = useApi()
    console.log('api', api.defaults.baseURL);
    const accountStatistics = useQuery<AccountStatistics>({
        queryKey: ["account-statistics"],
        queryFn: () => getAccountStatistics(api),
        staleTime: 5 * 60 * 1000 // 5 minutes
    })

    const transfersStatistics = useQuery<TransfersStatistics>({
        queryKey: ["transfers-statistics"],
        queryFn: () => getTransfersStatistics(api),
        staleTime: 5 * 60 * 1000 // 5 minutes
    })

    return {
        accountStatistics,
        transfersStatistics
    }
}

export default useStatistics
