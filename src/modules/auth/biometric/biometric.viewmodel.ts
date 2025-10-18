import { useApi } from "@/src/core/api/clients.hooks";
import { selectSetAuth, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { authenticate } from "../login/login.service";
import { biometricAuthenticate, checkDeviceBiometric } from './biometric.service';
import { selectIsEnabled, selectIsInitialized, selectSetEnabled, selectSetInitialized, useBiometricStore } from './biometric.store';
import { clearCredentials, getCredentials } from "./biometric.utils";
import { AuthResponse } from '../auth.model';

type BiometricViewModel = {
    isBiometricAvailable: boolean;
    isInitialized: boolean;
    loading: boolean;
    error: string | null;
    enableBiometric: () => Promise<boolean>;
    disableBiometric: () => Promise<boolean>;
    login: () => Promise<AuthResponse>;
    isSuccess: boolean;
    setInitialized: (value: boolean) => void;
}

export const useBiometricViewModel = (): BiometricViewModel => {
    const [isBiometricAvailable, setIsBiometricAvailable] = useState<boolean>(false);
    const { api } = useApi();
    const setAuth = useAuthStore(selectSetAuth);
    const setEnabled = useBiometricStore(selectSetEnabled);
    const isInitialized = useBiometricStore(selectIsInitialized);
    const setInitialized = useBiometricStore(selectSetInitialized);


    useEffect(() => {
        const controller = new AbortController();

        const checkBiometricAvailability = async () => {
            try {
                const available = await checkDeviceBiometric();
                if (!controller.signal.aborted) {
                    setIsBiometricAvailable(available);
                }
            } catch (error) {
                console.error('Failed to check biometric availability', error);
            }
        };

        checkBiometricAvailability();

        return () => controller.abort();
    }, []);

    const enableBiometric = async (): Promise<boolean> => {
        try {
            if (!isBiometricAvailable) {
                console.error('Biometric not available');
                return false;
            }

            const { success, error } = await biometricAuthenticate();

            if (!success) {
                throw new Error(error || 'Unknown error');
            }

            setEnabled(success);
            setInitialized(success);
            return success;
        } catch (error) {
            console.error('Failed to enable biometrics:', error);
            return false;
        }
    };

    const disableBiometric = async () => {
        try {
            await clearCredentials();
            setEnabled(false);
            return true;
        } catch (error) {
            console.error('Failed to disable biometrics:', error);
            return false;
        }
    };

    const { mutateAsync, isPending, error, isSuccess } = useMutation<AuthResponse, Error, void>({
        mutationFn: async () => {
            const { success, error } = await biometricAuthenticate();

            if (!success) {
                throw new Error(error || 'Authentication failed');
            }

            const credentials = await getCredentials();
            if (!credentials) {
                throw new Error('No stored credentials found');
            }

            return authenticate(api, credentials);
        },
        onSuccess: (data) => {
            const { success, refreshToken, accessToken, ...user } = data.body;
            setAuth(user, accessToken.token);
            const { accessToken: { token } } = data.body;
            setAuth({ ...user, email: user.signupKey }, token);
        }
    });
    return {
        isSuccess,
        setInitialized,
        isBiometricAvailable,
        enableBiometric,
        disableBiometric,
        isInitialized,
        loading: isPending,
        error: error?.message || null,
        login: mutateAsync,
    };
};

