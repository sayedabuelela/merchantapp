import { AccountType } from '@/src/modules/onboarding/account-type/account-type.model';
import { create } from 'zustand';

interface OnboardingState {
    accountType: AccountType | null;
    setAccountType: (type: AccountType | null) => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
    accountType: null,
    setAccountType: (type: AccountType | null) => set({ accountType: type }),
}));

export const accountTypeSelector = (state: OnboardingState) => state.accountType;
export const setAccountTypeSelector = (state: OnboardingState) => state.setAccountType;