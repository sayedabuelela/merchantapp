import {
    BASE_CURRENCY,
    isVirtualCurrency,
    SelectedCurrencyId,
    toDisplayCode,
} from '@/src/core/constants/currencies';
import {
    selectSelectedCurrency,
    selectSetSelectedCurrency,
    selectResetSelectedCurrency,
    useCurrencyStore,
} from '@/src/core/stores/currency.store';
import useCurrencyConversionEnabled from './useCurrencyConversionEnabled';

/**
 * Single guard point for the global selected currency.
 * When the "currency conversion" feature is off, everything is forced to EGP/inert
 * so requests and query keys stay identical to pre-feature behavior.
 */
const useSelectedCurrency = () => {
    const isEnabled = useCurrencyConversionEnabled();
    const storedCurrency = useCurrencyStore(selectSelectedCurrency);
    const setSelectedCurrency = useCurrencyStore(selectSetSelectedCurrency);
    const resetSelectedCurrency = useCurrencyStore(selectResetSelectedCurrency);

    // The store holds the API id, so virtualness is read off it rather than
    // guessed from a 3-letter code ('USD' alone cannot tell main from virtual).
    const apiId: SelectedCurrencyId = isEnabled ? storedCurrency : BASE_CURRENCY;
    const isVirtual = isVirtualCurrency(apiId);
    const displayCode = toDisplayCode(apiId);

    return {
        isEnabled,
        displayCode,
        isVirtual,
        apiId,
        // Spread into list params: ...(currencyParam && { currency: currencyParam })
        // Sent for every selection including EGP, matching web. Flag off = omitted,
        // so pre-feature requests stay byte-identical.
        currencyParam: isEnabled ? apiId : undefined,
        setSelectedCurrency,
        resetSelectedCurrency,
    };
};

export default useSelectedCurrency;
