import { useApi } from "@/src/core/api/clients.hooks"
import { useQuery } from "@tanstack/react-query"
import { getAccountsList } from "../balance.services"
import { AccountsListResponse, AccountsListParams } from "../balance.model"
import { useAuthStore, selectUser } from "../../auth/auth.store"
import usePermissions from "../../auth/hooks/usePermissions"
import useHasFeature from "../../auth/hooks/useHasFeature";

const useAccounts = (params?: AccountsListParams) => {
    const { api } = useApi()
    const user = useAuthStore(selectUser)
    const { canViewBalance } = usePermissions(user?.actions!);
    const hasBalanceFeature = useHasFeature("multi accounts");
    console.log('canViewBalance : ',canViewBalance );
    console.log('hasBalanceFeature : ',hasBalanceFeature );
    
    const { data: accounts, isLoading, error } = useQuery<AccountsListResponse>({
        queryKey: ["accounts-list", params],
        queryFn: () => getAccountsList(api, params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!(canViewBalance && hasBalanceFeature),
    })

    return {
        accounts,
        isLoading,
        error
    }
}

export default useAccounts
