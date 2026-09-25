import { useApi } from '@/src/core/api/clients.hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import { I18nManager } from 'react-native';
import {
    inquireInstant,
    createInstantRequest,
} from '../instant-settlement.services';
import type {
    InquiryRequestDTO,
    CreateRequestDTO,
} from '../dto/instant-settlement.dto';
import { mapInquiry } from '../mappers/instant-settlement.mappers';
import type { InquiryBreakdown } from '../domain/instant-settlement.models';
import {
    normalizeInstantError,
    pickErrorMessage,
} from '../errors/instant-settlement.errors';
import { ELIGIBLE_QUERY_KEY } from './useEligibleTransactionsVM';
import { INSTANT_REQUESTS_QUERY_KEY } from './useInstantRequestsVM';

/**
 * Inquiry + create mutations for the instant-settlements v3 money path.
 * Pointed at `/v3/payment/instant-settlements/...`, payload `{ transactionIds }`, bare-object
 * inquiry response, typed error normalizer, NO Home redirect on success
 * (the screen switches to the Requests tab — §5).
 */
export const useInstantSettlementActionsVM = () => {
    const { api } = useApi();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const showError = (titleKey: string, fallbackKey: string, error: unknown) => {
        const normalized = normalizeInstantError(error);
        const description =
            pickErrorMessage(normalized, I18nManager.isRTL) || t(fallbackKey);
        toast.error(t(titleKey), {
            richColors: true,
            style: { borderWidth: 0 },
            description,
        });
    };

    const inquiryMutation = useMutation<InquiryBreakdown, unknown, InquiryRequestDTO>({
        mutationFn: async (request) => mapInquiry(await inquireInstant(api, request)),
        onError: (error) =>
            showError(
                'Settlement Inquiry Failed',
                'Failed to calculate settlement fees',
                error,
            ),
    });

    const createMutation = useMutation({
        mutationFn: (request: CreateRequestDTO) => createInstantRequest(api, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ELIGIBLE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [INSTANT_REQUESTS_QUERY_KEY] });
            toast.success(t('Settlement Requested'), {
                richColors: true,
                style: { borderWidth: 0 },
                description: t(
                    'Your instant settlement request has been submitted successfully',
                ),
            });
        },
        onError: (error) =>
            showError(
                'Settlement Request Failed',
                'Failed to submit settlement request',
                error,
            ),
    });

    return {
        // Inquiry
        inquireSettlementAsync: inquiryMutation.mutateAsync,
        isInquiring: inquiryMutation.isPending,
        inquiryData: inquiryMutation.data,
        inquiryError: inquiryMutation.error,

        // Create
        createRequestAsync: createMutation.mutateAsync,
        isRequesting: createMutation.isPending,
        requestData: createMutation.data,
        requestError: createMutation.error,
    };
};
