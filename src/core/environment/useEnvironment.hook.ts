import {useCallback} from 'react'
import {useEnvironmentStore} from "@/src/core/environment/environments.store";
import {Environment, Mode} from "@/src/core/environment/environments";

export function useEnvironment() {
    
    const {environment, mode, setEnvironment, setMode} = useEnvironmentStore()

    const toggleMode = useCallback(() => {
        setMode(mode === Mode.TEST ? Mode.LIVE : Mode.TEST)
    }, [mode, setMode])

    return {
        environment,
        mode,
        setEnvironment,
        setMode,
        toggleMode,
        isTestMode: mode === Mode.TEST,
        isLiveMode: mode === Mode.LIVE,
        isProduction: environment === Environment.PRODUCTION,
        isStaging: environment === Environment.STAGING
    }
}
