import { useNetworkStore, selectIsOnline, selectIsConnected, selectIsInternetReachable } from '../network/network.store';

/**
 * Hook to get network status from the global store.
 * The store is updated by NetworkProvider which monitors network state.
 */
export const useNetworkStatus = () => {
    const isConnected = useNetworkStore(selectIsConnected);
    const isInternetReachable = useNetworkStore(selectIsInternetReachable);
    const hasNetwork = useNetworkStore(selectIsOnline);

    return {
        isConnected,
        isInternetReachable,
        hasNetwork,
    };
};
