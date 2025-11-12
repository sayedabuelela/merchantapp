import { useNetworkState } from 'expo-network';

export const useNetworkStatus = () => {
    const networkState = useNetworkState();

    const isConnected = networkState.isConnected ?? true; // Default to true to avoid blocking if check fails
    const isInternetReachable = networkState.isInternetReachable ?? true;

    return {
        isConnected,
        isInternetReachable,
        hasNetwork: isConnected && isInternetReachable !== false,
    };
};
