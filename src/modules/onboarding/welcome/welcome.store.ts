import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WelcomeOnboardingState {
    isCompleted: boolean;

    // Actions
    setCompleted: (completed: boolean) => void;
}

export const useWelcomeOnboardingStore = create<WelcomeOnboardingState>()(
    persist(
        (set) => ({
            isCompleted: false,
            setCompleted: (completed) => {
                set({isCompleted: completed});
            },
        }),
        {
            name: 'welcome-onboarding-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                isCompleted: state.isCompleted,
            })
        }
    )
);