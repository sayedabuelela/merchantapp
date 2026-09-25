import { create } from 'zustand';
import { BASE_CURRENCY, SelectedCurrencyId } from '@/src/core/constants/currencies';

interface CurrencyState {
    // API id, NOT a display code: 'EGP', a real merchant currency ('USD'), or a
    // virtual id ('USD_VIRTUAL'). Storing the id is what keeps main USD and
    // virtual USD distinct; render it through `toDisplayCode()`.
    selectedCurrency: SelectedCurrencyId;
    setSelectedCurrency: (currency: SelectedCurrencyId) => void;
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
