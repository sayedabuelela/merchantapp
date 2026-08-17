import { create } from 'zustand';
import { BASE_CURRENCY, SelectableCurrency } from '@/src/core/constants/currencies';

interface CurrencyState {
    // Display code: 'EGP', a real merchant currency, or a virtual display code (USD/EUR/GBP/SAR/AED)
    selectedCurrency: SelectableCurrency;
    setSelectedCurrency: (currency: SelectableCurrency) => void;
    resetSelectedCurrency: () => void;
}

// Intentionally not persisted: app always launches in EGP (today's behavior),
// mirroring the balance activeAccount pattern.
export const useCurrencyStore = create<CurrencyState>()((set) => ({
    selectedCurrency: BASE_CURRENCY,
    setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
    resetSelectedCurrency: () => set({ selectedCurrency: BASE_CURRENCY }),
}));

// Selectors for optimal re-render control
export const selectSelectedCurrency = (state: CurrencyState) => state.selectedCurrency;
export const selectSetSelectedCurrency = (state: CurrencyState) => state.setSelectedCurrency;
export const selectResetSelectedCurrency = (state: CurrencyState) => state.resetSelectedCurrency;
