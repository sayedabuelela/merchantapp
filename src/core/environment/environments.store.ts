import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Environment, Mode } from './environments'

interface EnvironmentState {
    environment: Environment
    mode: Mode
    setEnvironment: (env: Environment) => void
    setMode: (mode: Mode) => void
}

export const useEnvironmentStore = create<EnvironmentState>()(
    persist(
        (set) => ({
            environment: Environment.PRODUCTION,
            mode: Mode.LIVE,
            setEnvironment: (environment) => set({environment}),
            setMode: (mode) => set({mode}),
        }),
        {
            name: 'environment-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                environment: state.environment,
                mode: state.mode,
            }),
        }
    )
)
// export const selectSetMode = useEnvironmentStore(s => s.setMode)
export const selectSetMode = (state: EnvironmentState) => state.setMode;