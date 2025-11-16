import { useApi } from "@/src/core/api/clients.hooks";
import { Mode } from "@/src/core/environment/environments";
import { selectSetMode, useEnvironmentStore } from "@/src/core/environment/environments.store";
import { useToast } from "@/src/core/providers/ToastProvider";
import { useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { AuthResponse } from "../auth.model";
import { storeCredentials } from "../biometric/biometric.utils";
import { fetchAndSyncMerchant } from "../hooks/useMerchant";
import { LoginError, LoginFormData } from './login.model';
import { authenticate } from "./login.service";

export const useLoginViewModel = () => {
    const { api } = useApi();
    // console.log('api : ',);
    
    const setAuth = useAuthStore((state) => state.setAuth);
    const setMode = useEnvironmentStore(selectSetMode);
    const queryClient = useQueryClient();
    const router = useRouter();
    const { showToast } = useToast?.() ?? { showToast: () => { } };
    const { t } = useTranslation();
    const {
        mutateAsync,
        isPending: isLoading,
        error,
        isSuccess
    } = useMutation<AuthResponse, LoginError, LoginFormData>({
        mutationFn: (credentials) => authenticate(api, credentials),
        onSuccess: async (data, credentials) => {
            // data maybe has body or twoFactorAuth
            await storeCredentials(credentials);
            if (data.twoFactorAuth) {
                showToast?.({ message: t('Two factor authentication required'), type: 'info' });
                router.push({
                    pathname: `/(auth)/(login)/login-twofactor-auth`,
                    params: credentials,
                })
                return;
            }
            
            const { accessToken: { token } } = data.body;
            const { success, refreshToken, accessToken, ...user } = data.body;
            setMode(data.body.isLive ? Mode.LIVE : Mode.TEST)
            setAuth({ ...user, email: user.signupKey }, token);
            await queryClient.fetchQuery({
                queryKey: ['merchantData', user.merchantId],
                queryFn: () => fetchAndSyncMerchant(api, useAuthStore.getState().updateUser),
            });
        },
    });

    return {
        login: mutateAsync,
        isLoading,
        error,
    };
}
