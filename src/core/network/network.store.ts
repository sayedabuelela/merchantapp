import { create } from 'zustand'

interface NetworkState {
    isConnected: boolean
    isInternetReachable: boolean | null
    setNetworkState: (isConnected: boolean, isInternetReachable: boolean | null) => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
    isConnected: true,
    isInternetReachable: true,
    setNetworkState: (isConnected, isInternetReachable) =>
        set({ isConnected, isInternetReachable }),
}))

// Selectors
export const selectIsOnline = (state: NetworkState) =>
    state.isConnected && state.isInternetReachable !== false

export const selectIsConnected = (state: NetworkState) => state.isConnected
export const selectIsInternetReachable = (state: NetworkState) => state.isInternetReachable
