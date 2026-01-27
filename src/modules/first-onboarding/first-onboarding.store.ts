import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirstOnboardingState } from './first-onboarding.model';

export const useFirstOnboardingStore = create<FirstOnboardingState>()(
    persist(
        (set) => ({
            hasSeenOnboarding: false,
            setHasSeenOnboarding: (value) => {
                set({ hasSeenOnboarding: value });
            },
        }),
        {
            name: 'first-onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                hasSeenOnboarding: state.hasSeenOnboarding,
            })
        }
    )
);

export const selectHasSeenOnboarding = (state: FirstOnboardingState) => state.hasSeenOnboarding;
export const selectSetHasSeenOnboarding = (state: FirstOnboardingState) => state.setHasSeenOnboarding;
