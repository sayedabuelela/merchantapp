import { useApi } from "@/src/core/api/clients.hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentLink, cancelPaymentLink, sharePaymentLink, markAsPaid } from "../api/ paymentLinksActions";
import { MarkAsPaidParams, ShareRequest, ShareResponse } from "../payment-links.model";
import { I18nManager } from "react-native";
import { CHECKOUT_URL } from "@/src/core/environment/environments";
import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import { AxiosInstance } from "axios";

const usePaymentLinkActionsVM = () => {
    const { api, paymentApi } = useApi();
    const queryClient = useQueryClient();
    const { isLiveMode } = useEnvironment()
    const deleteMutation = useMutation({
        mutationFn: (paymentLinkId: string) => deletePaymentLink(api, paymentLinkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-links"] });
        }
    });

    const cancelMutation = useMutation({
        mutationFn: (paymentLinkId: string) => cancelPaymentLink(api, paymentLinkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-links"] });
        }
    });

    const markAsPaidMutation = useMutation({
        mutationFn: (params: MarkAsPaidParams) =>
            markAsPaid(paymentApi, params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-links"] });
        }
    });

    const shareMutation = useMutation<ShareResponse, Error, ShareRequest>({
        mutationFn: (req: ShareRequest) => sharePaymentLink(api, req),
    });

    const generateSherableUrl = (paymentLinkId: string) => {
        return `${CHECKOUT_URL}/${I18nManager.isRTL ? "ar" : "en"}/paymentLinkPage?ppLink=${paymentLinkId},${isLiveMode ? "live" : "test"}`;
    }

    return {
        deleteMutation,
        cancelMutation,
        shareMutation,
        markAsPaidMutation,
        generateSherableUrl,
    }
}

export default usePaymentLinkActionsVM;