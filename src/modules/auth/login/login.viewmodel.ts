import { useAuthStore } from "@/src/modules/auth/auth.store";
import { useMutation } from '@tanstack/react-query';
import { LoginError, LoginFormData } from './login.model';
import { useApi } from "@/src/core/api/clients.hooks";
import { useBiometricStore } from "../biometric/biometric.store";
import { authenticate } from "./login.service";
import { storeCredentials } from "../biometric/biometric.utils";
import { AuthResponse } from "../auth.model";
import { useEnvironmentStore, selectSetMode } from "@/src/core/environment/environments.store";
import { Mode } from "@/src/core/environment/environments";
import { useQueryClient } from "@tanstack/react-query";
import { getMerchant } from "../login/login.service";
import { fetchAndSyncMerchant } from "../hooks/useMerchant";

export const useLoginViewModel = () => {
    const { api } = useApi();
    const setAuth = useAuthStore((state) => state.setAuth);
    const isEnabled = useBiometricStore((state) => state.isEnabled);
    const setMode = useEnvironmentStore(selectSetMode);
    const queryClient = useQueryClient();


    const {
        mutateAsync,
        isPending: isLoading,
        error,
        isSuccess
    } = useMutation<AuthResponse, LoginError, LoginFormData>({
        mutationFn: (credentials) => authenticate(api, credentials),
        onSuccess: async (data, credentials) => {
            // console.log("credentials : ", credentials);
            // console.log("authenticate data : ", data.body);
            const { accessToken: { token } } = data.body;
            const { success, refreshToken, accessToken, ...user } = data.body;
            setMode(data.body.isLive ? Mode.LIVE : Mode.TEST)
            setAuth({ ...user, email: user.signupKey }, token);
            await storeCredentials(credentials);
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
