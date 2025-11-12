import { useMemo } from 'react'
import { useEnvironmentStore } from "@/src/core/environment/environments.store";
import { createApiClient, createPaymentApiClient } from "@/src/core/api/clients";
import { AxiosInstance } from "axios";

export const useApi = (): { api: AxiosInstance, paymentApi: AxiosInstance } => {
    const mode = useEnvironmentStore(s => s.mode)
    const environment = useEnvironmentStore(s => s.environment)

    const api = useMemo(() => {
        return createApiClient(environment, mode)
    }, [environment, mode])

    const paymentApi = useMemo(() => {
        return createPaymentApiClient(environment, mode)
    }, [environment, mode])

    return {
        api,
        paymentApi
    }
}
