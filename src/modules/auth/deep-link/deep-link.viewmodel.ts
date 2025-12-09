import { useApi } from '@/src/core/api/clients.hooks';
import { Mode } from '@/src/core/environment/environments';
import { selectSetMode, useEnvironmentStore } from '@/src/core/environment/environments.store';
import { useToast } from '@/src/core/providers/ToastProvider';
import { decryptToken } from '@/src/core/utils/crypto';
import { useAuthStore, selectSetAuth, selectUpdateToken } from '@/src/modules/auth/auth.store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/src/core/navigation/routes';
import { DeepLinkParams, DeepLinkError, DeepLinkAuthResult } from './deep-link.model';
import { authenticateByToken } from './deep-link.service';
import { getMerchant } from '@/src/modules/auth/login/login.service';

export const useDeepLinkViewModel = () => {
  const { api } = useApi();
  const setAuth = useAuthStore(selectSetAuth);
  const updateToken = useAuthStore(selectUpdateToken);
  const setMode = useEnvironmentStore(selectSetMode);
  const router = useRouter();
  const { showToast } = useToast?.() ?? { showToast: () => {} };
  const { t } = useTranslation();

  const {
    mutateAsync: authenticateWithDeepLink,
    isPending: isLoading,
    error,
  } = useMutation<DeepLinkAuthResult, DeepLinkError, DeepLinkParams>({
    mutationFn: async (params: DeepLinkParams): Promise<DeepLinkAuthResult> => {
      // 1. Validate params
      if (!params.accessToken || !params.currentMerchantPayformanceId) {
        const error = new Error('Missing required parameters') as DeepLinkError;
        error.code = 'MISSING_PARAMS';
        throw error;
      }

      // 2. Decrypt BOTH params
      let decryptedToken: string;
      let decryptedMerchantId: string;

      try {
        decryptedToken = decryptToken(params.accessToken);
        decryptedMerchantId = decryptToken(params.currentMerchantPayformanceId);
      } catch (err) {
        const error = new Error('Failed to decrypt parameters') as DeepLinkError;
        error.code = 'DECRYPTION_FAILED';
        throw error;
      }

      // 3. Call auth-by-token API to get real accessToken
      const authResponse = await authenticateByToken(api, decryptedToken, decryptedMerchantId);

      // 4. Extract real accessToken from response
      const realToken = authResponse.body.accessToken.token;
      const isLive = authResponse.body.isLive;

      // 5. Set token in store FIRST so getMerchant() can use it via interceptor
      updateToken(realToken);

      // 6. Call getMerchant to get FULL user data
      // (interceptor will automatically add Bearer token from store)
      const merchantResponse = await getMerchant(api);
      const fullUserData = merchantResponse.body;

      return { realToken, fullUserData, isLive };
    },
    onSuccess: async ({ realToken, fullUserData, isLive }: DeepLinkAuthResult) => {
      // 7. Set environment mode
      setMode(isLive ? Mode.LIVE : Mode.TEST);

      // 8. Set auth with FULL user data and real token
      setAuth({ ...fullUserData, email: fullUserData.signupKey }, realToken);

      // 9. Show success toast
      showToast?.({
        message: t('Login successful'),
        type: 'success',
      });

      // 10. Redirect to home
      router.replace(ROUTES.TABS.HOME);
    },
    onError: (error: DeepLinkError) => {
      console.error('Deep link authentication error:', error);

      // Show appropriate error message
      let message = t('Authentication failed. Please try again.');

      if (error.code === 'MISSING_PARAMS') {
        message = t('Invalid deep link. Missing required parameters.');
      } else if (error.code === 'DECRYPTION_FAILED') {
        message = t('Failed to decrypt token. The link may be invalid or expired.');
      }

      showToast?.({
        message,
        type: 'danger',
      });
      
      // Redirect to login
      router.replace(ROUTES.AUTH.LOGIN);
    },
  });

  return {
    authenticateWithDeepLink,
    isLoading,
    error,
  };
};
