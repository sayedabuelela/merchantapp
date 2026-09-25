import { useApi } from '@/src/core/api/clients.hooks';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner-native';
import { I18nManager } from 'react-native';
import { fetchSuggestions } from '../instant-settlement.services';
import type { SuggestionsRequestDTO } from '../dto/instant-settlement.dto';
import { mapSuggestions } from '../mappers/instant-settlement.mappers';
import type { CustomAmountSuggestions } from '../domain/instant-settlement.models';
import {
    normalizeInstantError,
    pickErrorMessage,
} from '../errors/instant-settlement.errors';

/**
 * Custom-amount suggestions (POST {BASE}/instant/suggestions, FIN-20780).
 * A mutation: the sheet fires it (debounced) on a valid target amount and
 * renders the nearest below/above transaction sets.
 */
export const useSuggestionsVM = () => {
    const { api } = useApi();
    const { t } = useTranslation();

    const mutation = useMutation<
        CustomAmountSuggestions,
        unknown,
        SuggestionsRequestDTO
    >({
        mutationFn: async (body) => mapSuggestions(await fetchSuggestions(api, body)),
        onError: (error) => {
            const normalized = normalizeInstantError(error);
            const description =
                pickErrorMessage(normalized, I18nManager.isRTL) ||
                t('Could not load suggestions');
            toast.error(t('Suggestions Failed'), {
                richColors: true,
                style: { borderWidth: 0 },
                description,
            });
        },
    });

    return {
        fetchSuggestionsAsync: mutation.mutateAsync,
        suggestions: mutation.data,
        isLoadingSuggestions: mutation.isPending,
        suggestionsError: mutation.error,
        resetSuggestions: mutation.reset,
    };
};
