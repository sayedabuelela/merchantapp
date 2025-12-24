import { useApi } from "@/src/core/api/clients.hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Route, router } from "expo-router";
import { PaymentLink, PaymentLinkResponse } from "../payment-links.model";
import { CreatePaymentLinkTypes } from "../payment-links.scheme";
import {
    createPaymentLink,
    getPaymentLink,
    updatePaymentLink
} from "../payment-links.services";
import { usePaymentLinkStore } from "../paymentLink.store";
import { ROUTES } from "@/src/core/navigation/routes";
import { useToast } from "@/src/core/providers/ToastProvider";
import { selectUser, useAuthStore } from "@/src/modules/auth/auth.store";
import usePermissions from "@/src/modules/auth/hooks/usePermissions";

const usePaymentLinkVM = (paymentLinkId?: string) => {
    const { api } = useApi();
    const queryClient = useQueryClient();
    const { showToast } = useToast?.() ?? { showToast: () => { } };
    const isEditMode = !!paymentLinkId;
    // console.log("usePaymentLinkVM isEditMode", isEditMode);
    // Fetch payment link for edit mode
    const {
        data: paymentLink,
        isLoading: isLoadingPaymentLink,
        error: paymentLinkDetailsError
    } = useQuery<PaymentLinkResponse, Error, PaymentLink>({
        queryKey: ["payment-links", paymentLinkId],
        queryFn: () => getPaymentLink(api, paymentLinkId!),
        enabled: isEditMode,
        select: (response) => response.data,
    });

    // Get permissions
    const user = useAuthStore(selectUser);
    const { canEditPaymentLink, canCreatePaymentLinks } = usePermissions(
        user?.actions || {},
        user?.merchantId,
        paymentLink?.createdByUserId
    );

    // Create mutation
    const {
        mutateAsync: createNewPaymentLink,
        isPending: isCreatingPaymentLink,
        error: createPaymentLinkError,
    } = useMutation<PaymentLinkResponse, Error, CreatePaymentLinkTypes>({
        mutationFn: async (data) => {
            if (!canCreatePaymentLinks) {
                throw new Error('Unauthorized: You do not have permission to create payment links');
            }
            return createPaymentLink(api, data);
        },
        onSuccess: async (response) => {
            await queryClient.invalidateQueries({ queryKey: ["payment-links"], exact: false });
            const qrCode = usePaymentLinkStore.getState().qrCode;
            usePaymentLinkStore.getState().clearFormData();
            showToast({ message: 'Payment link created successfully',type: 'success' });
            router.replace({
                pathname: "/payment-links/create-success",
                params: { 
                    paymentLinkId: response.data.paymentLinkId,
                    ...(qrCode && { query: 'qr-code' })
                }
            });
        },
    });

    // Update mutation
    const {
        mutateAsync: editPaymentLink,
        isPending: isUpdatingPaymentLink,
        error: editPaymentLinkError,
    } = useMutation<PaymentLinkResponse, Error, CreatePaymentLinkTypes>({
        mutationFn: async (data) => {
            if (!canEditPaymentLink) {
                throw new Error('Unauthorized: You do not have permission to edit this payment link');
            }
            return updatePaymentLink(api, paymentLinkId!, data);
        },
        onSuccess: async (response) => {
            await queryClient.invalidateQueries({ queryKey: ["payment-links"], exact: false });
            usePaymentLinkStore.getState().clearFormData();
            if (response.data.paymentLinkId) {
                showToast({ message: 'Payment link updated successfully',type: 'success' });
                router.dismissTo(`/payment-links/${response.data.paymentLinkId}`);
            } else {
                showToast({ message: 'Payment link updated successfully',type: 'success' });
                router.replace(ROUTES.TABS.PAYMENT_LINKS as Route);
            }
        },
    });

    // Unified submit handler
    const submitPaymentLink = async (data: CreatePaymentLinkTypes) => {
        if (isEditMode) {
            delete data.currency;
            return editPaymentLink(data);
        }
        return createNewPaymentLink(data);
    };

    return {
        // Data
        paymentLink,
        isLoadingPaymentLink,

        // Operations
        submitPaymentLink,
        isSubmitting: isCreatingPaymentLink || isUpdatingPaymentLink,

        // Errors
        error: createPaymentLinkError || editPaymentLinkError || paymentLinkDetailsError,

        // Mode
        isEditMode,
    };
};

export default usePaymentLinkVM;