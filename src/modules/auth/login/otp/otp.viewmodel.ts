import { useApi } from "@/src/core/api/clients.hooks";
import { Mode } from "@/src/core/environment/environments";
import { selectSetMode, useEnvironmentStore } from "@/src/core/environment/environments.store";
import { ROUTES } from "@/src/core/navigation/routes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AuthResponse } from "../../auth.model";
import { useAuthStore } from "../../auth.store";
import { useBiometricViewModel } from "../../biometric/biometric.viewmodel";
import { fetchAndSyncMerchant } from "../../hooks/useMerchant";
import { LoginFormData } from "../login.model";
import { authenticate } from "../login.service";
import { GenerateOtpError, GenerateOtpResponse, VerifyCodeError } from "./otp.model";
import { authenticateWith2fa } from "./otp.service";

const useOtp = () => {
    const { api } = useApi();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setMode = useEnvironmentStore(selectSetMode);
    const { isBiometricAvailable, isInitialized } = useBiometricViewModel();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { mutateAsync: generateOtp, isPending: isGenerating, error } = useMutation<GenerateOtpResponse, GenerateOtpError, LoginFormData>({
        mutationFn: (credentials) => authenticate(api, credentials),
    });

    const { mutateAsync: verifyOtp, isPending: isVerifying, error: verifyError, reset: verifyReset } = useMutation<AuthResponse, VerifyCodeError, { signupKey: string, code: string }>({
        mutationFn: ({ signupKey, code }) => authenticateWith2fa(api, { signupKey, code }),
        onSuccess: async (data, { signupKey }) => {
            const { accessToken: { token } } = data.body;
            const { success, refreshToken, accessToken, ...user } = data.body;
            setMode(data.body.isLive ? Mode.LIVE : Mode.TEST)
            setAuth({ ...user, email: user.signupKey }, token);
            // await storeCredentials(credentials);
            await queryClient.fetchQuery({
                queryKey: ['merchantData', user.merchantId],
                queryFn: () => fetchAndSyncMerchant(api, useAuthStore.getState().updateUser),
            });
            if (isBiometricAvailable && !isInitialized) {
                console.log('Biometric not initialized');
                router.replace(ROUTES.AUTH.ENABLE_BIOMETRIC);
            } else {
                console.log('Biometric initialized');
                // router.replace(ROUTES.TABS.ROOT);
                router.replace(ROUTES.TABS.SETTINGS);
                // router.replace(ROUTES.ONBOARDING.ACCOUNT_TYPE);
            }
            // router.replace(ROUTES.TABS.HOME);
        }
    });

    return {
        generateOtp,
        isGenerating,
        error,
        verifyOtp,
        isVerifying,
        verifyError,
        verifyReset
    }
}

export default useOtp;