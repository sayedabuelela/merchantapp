import { create } from 'zustand';

interface ActiveAccount {
    accountId: string;
    accountName: string;
}

interface BalanceState {
    activeAccount: ActiveAccount | null;
    setActiveAccount: (account: ActiveAccount) => void;
    resetActiveAccount: () => void;
}

export const useBalanceStore = create<BalanceState>()((set) => ({
    activeAccount: null,
    setActiveAccount: (account) => set({ activeAccount: account }),
    resetActiveAccount: () => set({ activeAccount: null }),
}));

// Selectors for optimal re-render control
export const selectActiveAccount = (state: BalanceState) => state.activeAccount;
export const selectActiveAccountId = (state: BalanceState) => state.activeAccount?.accountId;
export const selectSetActiveAccount = (state: BalanceState) => state.setActiveAccount;
export const selectResetActiveAccount = (state: BalanceState) => state.resetActiveAccount;
