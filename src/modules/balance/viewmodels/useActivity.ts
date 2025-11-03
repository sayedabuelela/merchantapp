import { Activity, ActivityDetailsResponse, PaymentDetailsResponse, Transfer, TransferDetailsResponse } from "../balance.model";
import { extractTransferReference, getActivityDetails, getPaymentDetails, getTransferDetails } from "../balance.services";
import { useApi } from "@/src/core/api/clients.hooks";
import { useQuery } from "@tanstack/react-query";

export const useActivityDetails = (activityId: string) => {
    const { api } = useApi();
    return useQuery<ActivityDetailsResponse, Error, Activity>({
        queryKey: ["activity-details", activityId],
        queryFn: () => getActivityDetails(api, activityId),
        select: (response) => response.data,
    });
};


export const useActivityTransferDetails = (
    originReference: string,
    options?: any
) => {
    const { api } = useApi();
    const localOriginReference = extractTransferReference(originReference);

    return useQuery<TransferDetailsResponse, Error, Transfer>({
        queryKey: ["transfers-details", localOriginReference],
        queryFn: () => getTransferDetails(api, localOriginReference),
        enabled: !!localOriginReference && (options?.enabled ?? true),
        ...options,
    });
};


export const useActivityPaymentDetails = (originReference: string, options?: any) => {
    const { api } = useApi();
    return useQuery<PaymentDetailsResponse, Error, Transfer>({
        queryKey: ["payments-details", originReference],
        queryFn: () => getPaymentDetails(api, originReference),
        select: (response) => response.data.body,
        enabled: !!originReference && (options?.enabled ?? true),
        ...options,
    });
};