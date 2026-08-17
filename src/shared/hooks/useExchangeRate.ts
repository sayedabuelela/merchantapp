import { useQuery } from '@tanstack/react-query';
import { useApi } from '@/src/core/api/clients.hooks';
import { BASE_CURRENCY, isVirtualDisplayCode } from '@/src/core/constants/currencies';
import { fetchExchangeRate } from '@/src/modules/payments/payments.services';
import { ExchangeRateResponse } from '@/src/modules/payments/payments.model';
import useCurrencyConversionEnabled from './useCurrencyConversionEnabled';

/**
 * Live exchange rate for a virtual currency display code (e.g. "USD") against EGP.
 * Display-only preview — the backend recomputes the authoritative amount on submit.
 * Disabled entirely when the feature flag is off or the currency is not virtual.
 */
const useExchangeRate = (from?: string | null) => {
    const isEnabled = useCurrencyConversionEnabled();
    const { api } = useApi();

    const query = useQuery<ExchangeRateResponse, Error>({
        queryKey: ['exchange-rate', from, BASE_CURRENCY],
        queryFn: () => fetchExchangeRate(api, from as string, BASE_CURRENCY),
        enabled: isEnabled && isVirtualDisplayCode(from),
        staleTime: 60 * 1000,
    });

    return {
        ...query,
        rate: query.data?.rates?.[BASE_CURRENCY],
    };
};

export default useExchangeRate;
