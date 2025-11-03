import { useApi } from "@/src/core/api/clients.hooks";
import { useQuery } from "@tanstack/react-query";
import { ActivitiesResponse, Activity, SettlementWindowParams } from "../balance.model";
import { getSettlementWindow } from "../balance.services";

export const useSettlementWindow = (params: SettlementWindowParams) => {
    const { api } = useApi();

    return useQuery<ActivitiesResponse, Error, Activity[]>({
        queryKey: ["settlement-window", params],
        queryFn: () => getSettlementWindow(api, params),
        select: (response) => response.data,
        enabled: !!params.accountId,
    });
};