import { useApi } from '@/src/core/api/clients.hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import type {
    InstantSettlementInquiryRequest,
    InstantSettlementRequestPayload,
} from '../instant-settlement.model';
import {
    inquireInstantSettlement,
    requestInstantSettlement,
} from '../instant-settlement.services';
import { router } from 'expo-router';
import { ROUTES } from '@/src/core/navigation/routes';

export const useInstantSettlementActionsVM = () => {
    const { api } = useApi();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    /**
     * Inquiry mutation - calculates fees for selected transactions
     */
    const inquiryMutation = useMutation({
        mutationFn: (request: InstantSettlementInquiryRequest) =>
            inquireInstantSettlement(api, request),
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message || t('Failed to calculate settlement fees');
            toast.error(t('Settlement Inquiry Failed'), {
                richColors: true,
                style: { borderWidth: 0 },
                description: errorMessage,
            });
        },
    });

    /**
     * Request mutation - submits instant settlement request
     * Invalidates settlement-transactions on success
     */
    const requestMutation = useMutation({
        mutationFn: (request: InstantSettlementRequestPayload) =>
            requestInstantSettlement(api, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settlement-transactions'] });

            toast.success(t('Settlement Requested'), {
                richColors: true,
                style: { borderWidth: 0 },
                description: t('Your instant settlement request has been submitted successfully'),
            });
            router.push(ROUTES.TABS.HOME);
        },
        onError: (error: any) => {
            const errorMessage =
                error.response?.data?.message || t('Failed to submit settlement request');
            toast.error(t('Settlement Request Failed'), {
                richColors: true,
                style: { borderWidth: 0 },
                description: errorMessage,
            });
        },
    });

    return {
        // Inquiry
        inquireSettlement: inquiryMutation.mutate,
        inquireSettlementAsync: inquiryMutation.mutateAsync,
        isInquiring: inquiryMutation.isPending,
        inquiryData: inquiryMutation.data,
        inquiryError: inquiryMutation.error,

        // Request
        requestSettlement: requestMutation.mutate,
        requestSettlementAsync: requestMutation.mutateAsync,
        isRequesting: requestMutation.isPending,
        requestData: requestMutation.data,
        requestError: requestMutation.error,
    };
};
