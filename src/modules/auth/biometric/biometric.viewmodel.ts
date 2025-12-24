import { useApi } from "@/src/core/api/clients.hooks";
import { Mode } from "@/src/core/environment/environments";
import { selectSetMode, useEnvironmentStore } from "@/src/core/environment/environments.store";
import { useToast } from "@/src/core/providers/ToastProvider";
import { selectSetAuth, useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { AuthResponse } from '../auth.model';
import { fetchAndSyncMerchant } from "../hooks/useMerchant";
import { authenticate } from "../login/login.service";
import { biometricAuthenticate, checkDeviceBiometric } from './biometric.service';
import { selectIsInitialized, selectSetEnabled, selectSetInitialized, useBiometricStore } from './biometric.store';
import { getCredentials } from "./biometric.utils";
import { toast } from "sonner-native";

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
    const setMode = useEnvironmentStore(selectSetMode);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { showToast } = useToast?.() ?? { showToast: () => { } };
    const { t } = useTranslation();


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
            // await clearCredentials();
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
            console.log('credentials : ', credentials);
            if (!credentials) {
                throw new Error('No stored credentials found');
            }

            return authenticate(api, { ...credentials, biometricEnabled: true });
        },
        onSuccess: async (data) => {
            console.log('biometricAuthenticate data : ', data);

            // Handle 2FA requirement
            if (data.twoFactorAuth) {
                const credentials = await getCredentials();
                showToast?.({ message: t('Two factor authentication required'), type: 'info' });
                // toast.info(t('Two factor authentication required'));
                if (credentials) {
                    router.push({
                        pathname: `/(auth)/(login)/login-twofactor-auth`,
                        params: { email: credentials.email, password: credentials.password },
                    });
                }
                return;
            }

            // Extract auth data
            const { accessToken: { token } } = data.body;
            const { success, refreshToken, accessToken, ...user } = data.body;

            // Set environment mode based on isLive flag
            setMode(data.body.isLive ? Mode.LIVE : Mode.TEST);

            // Store auth
            setAuth({ ...user, email: user.signupKey }, token);

            // Fetch and sync merchant data
            await queryClient.fetchQuery({
                queryKey: ['merchantData', user.merchantId],
                queryFn: () => fetchAndSyncMerchant(api, useAuthStore.getState().updateUser),
            });
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

