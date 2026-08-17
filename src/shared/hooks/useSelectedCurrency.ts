import {
    BASE_CURRENCY,
    DISPLAY_TO_VIRTUAL,
    isVirtualDisplayCode,
    VirtualCurrencyId,
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

    const displayCode = isEnabled ? storedCurrency : BASE_CURRENCY;
    const isVirtual = isEnabled && isVirtualDisplayCode(displayCode);
    const apiId: VirtualCurrencyId | undefined = isVirtual
        ? DISPLAY_TO_VIRTUAL[displayCode]
        : undefined;

    return {
        isEnabled,
        displayCode,
        isVirtual,
        apiId,
        // Spread into list params: ...(currencyParam && { currency: currencyParam })
        currencyParam: apiId,
        setSelectedCurrency,
        resetSelectedCurrency,
    };
};

export default useSelectedCurrency;
