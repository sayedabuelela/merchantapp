import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BiometricState {
  isEnabled: boolean;
  isInitialized: boolean;

  // Actions
  setEnabled: (enabled: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useBiometricStore = create<BiometricState>()(
  persist(
    (set) => ({
      isEnabled: false,
      isInitialized: false,
      setEnabled: (enabled) => {
        set({ isEnabled: enabled });
      },
      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },
    }),
    {
      name: 'biometric-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isEnabled: state.isEnabled,
        isInitialized: state.isInitialized
      })
    }
  )
);

export const selectIsEnabled = (state: BiometricState) => state.isEnabled;
export const selectIsInitialized = (state: BiometricState) => state.isInitialized;

export const selectSetEnabled = (state: BiometricState) => state.setEnabled;
export const selectSetInitialized = (state: BiometricState) => state.setInitialized;