import React, { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import * as Network from 'expo-network'
import { useNetworkStore, selectIsOnline } from '../network/network.store'
import OfflineBanner from '../network/OfflineBanner'

interface NetworkProviderProps {
    children: React.ReactNode
}

const NetworkProvider = ({ children }: NetworkProviderProps) => {
    const setNetworkState = useNetworkStore((state) => state.setNetworkState)
    const isOnline = useNetworkStore(selectIsOnline)
    const appState = useRef(AppState.currentState)

    const checkNetworkStatus = async () => {
        try {
            const networkState = await Network.getNetworkStateAsync()
            setNetworkState(
                networkState.isConnected ?? true,
                networkState.isInternetReachable ?? true
            )
        } catch (error) {
            // If check fails, assume connected to avoid blocking
            setNetworkState(true, true)
        }
    }

    useEffect(() => {
        // Initial check
        checkNetworkStatus()

        // Check on app state change (foreground/background)
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App came to foreground, check network
                checkNetworkStatus()
            }
            appState.current = nextAppState
        })

        // Poll network status periodically when app is active
        const intervalId = setInterval(() => {
            if (appState.current === 'active') {
                checkNetworkStatus()
            }
        }, 5000) // Check every 5 seconds

        return () => {
            subscription.remove()
            clearInterval(intervalId)
        }
    }, [setNetworkState])

    return (
        <>
            {children}
            <OfflineBanner isVisible={!isOnline} />
        </>
    )
}

export default NetworkProvider
