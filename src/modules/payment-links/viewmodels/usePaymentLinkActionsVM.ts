import { useApi } from "@/src/core/api/clients.hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentLink, cancelPaymentLink, sharePaymentLink, markAsPaid } from "../api/ paymentLinksActions";
import { MarkAsPaidParams, ShareRequest, ShareResponse } from "../payment-links.model";
import { I18nManager } from "react-native";
import { CHECKOUT_URL } from "@/src/core/environment/environments";
import { useEnvironment } from "@/src/core/environment/useEnvironment.hook";
import { AxiosInstance } from "axios";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import usePermissions from "@/src/modules/auth/hooks/usePermissions";

const usePaymentLinkActionsVM = (createdByUserId?: string) => {
    const { api, paymentApi } = useApi();
    const queryClient = useQueryClient();
    const { isLiveMode } = useEnvironment();

    // Get permissions
    const user = useAuthStore(selectUser);
    const {
        canDeletePaymentLink,
        canCancelPaymentLink,
        canEditPaymentLink
    } = usePermissions(
        user?.actions || {},
        user?.merchantId,
        createdByUserId
    );
    const deleteMutation = useMutation({
        mutationFn: async (paymentLinkId: string) => {
            if (!canDeletePaymentLink) {
                throw new Error('Unauthorized: You do not have permission to delete this payment link');
            }
            return deletePaymentLink(api, paymentLinkId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-links"] });
        }
    });

    const cancelMutation = useMutation({
        mutationFn: async (paymentLinkId: string) => {
            if (!canCancelPaymentLink) {
                throw new Error('Unauthorized: You do not have permission to cancel this payment link');
            }
            return cancelPaymentLink(api, paymentLinkId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-links"] });
        }
    });

    const markAsPaidMutation = useMutation({
        mutationFn: async (params: MarkAsPaidParams) => {
            if (!canEditPaymentLink) {
                throw new Error('Unauthorized: You do not have permission to mark this payment link as paid');
            }
            return markAsPaid(paymentApi, params);
        },
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