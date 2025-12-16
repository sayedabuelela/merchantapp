import { useApi } from '@/src/core/api/clients.hooks';
import { Mode } from '@/src/core/environment/environments';
import { selectSetMode, useEnvironmentStore } from '@/src/core/environment/environments.store';
import { useToast } from '@/src/core/providers/ToastProvider';
import { decryptToken } from '@/src/core/utils/crypto';
import { useAuthStore, selectSetAuth } from '@/src/modules/auth/auth.store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/src/core/navigation/routes';
import { DeepLinkParams, DeepLinkError, DeepLinkAuthResult } from './deep-link.model';
import { authenticateByToken } from './deep-link.service';
import { fetchAndSyncMerchant } from '../hooks/useMerchant';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Decrypt deep link parameters
 * @throws DeepLinkError with code 'DECRYPTION_FAILED' on failure
 */
const decryptParams = (params: DeepLinkParams) => {
  try {
    return {
      token: decryptToken(params.accessToken),
      merchantId: decryptToken(params.currentMerchantPayformanceId),
    };
  } catch (error) {
    console.error('[DeepLink] Decryption failed:', error);
    const err = new Error('Failed to decrypt parameters') as DeepLinkError;
    err.code = 'DECRYPTION_FAILED';
    throw err;
  }
};

/**
 * Validate required deep link parameters
 * @throws DeepLinkError with code 'MISSING_PARAMS' if invalid
 */
const validateParams = (params: DeepLinkParams): void => {
  if (!params.accessToken || !params.currentMerchantPayformanceId) {
    const error = new Error('Missing required parameters') as DeepLinkError;
    error.code = 'MISSING_PARAMS';
    throw error;
  }
};

/**
 * Get user-friendly error message based on error code
 */
const getErrorMessage = (error: DeepLinkError, t: (key: string) => string): string => {
  switch (error.code) {
    case 'MISSING_PARAMS':
      return t('Invalid deep link. Missing required parameters.');
    case 'DECRYPTION_FAILED':
      return t('Failed to decrypt token. The link may be invalid or expired.');
    default:
      return t('Authentication failed. Please try again.');
  }
};

/**
 * Deep Link Authentication ViewModel
 * 
 * Handles the complete authentication flow for deep links:
 * 1. Validate encrypted parameters
 * 2. Decrypt tokens
 * 3. Authenticate with backend
 * 4. Store auth state
 * 5. Navigate to home
 */
export const useDeepLinkViewModel = () => {
  const { api } = useApi();
  const setAuth = useAuthStore(selectSetAuth);
  const setMode = useEnvironmentStore(selectSetMode);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast?.() ?? { showToast: () => { } };
  const { t } = useTranslation();

  const mutation = useMutation<DeepLinkAuthResult, DeepLinkError, DeepLinkParams>({
    mutationFn: async (params): Promise<DeepLinkAuthResult> => {
      // Step 1: Validate params
      validateParams(params);

      // Step 2: Decrypt tokens
      const { token, merchantId } = decryptParams(params);
      console.log('[DeepLink] Tokens decrypted successfully');

      // Step 3: Authenticate with backend
      const response = await authenticateByToken(api, token, merchantId, params.v2);

      // Step 4: Extract user data and token from response
      // Same pattern as login.viewmodel.ts
      const { body } = response;
      const { accessToken, refreshToken, success, ...userData } = body;

      // Use the URL token (which we know is valid for authing) as the session token
      // The API-returned token was causing 401s in some environments
      return {
        token: token,
        user: userData,
        isLive: userData.isLive,
      };
    },

    onSuccess: async ({ token, user, isLive }) => {
      // Set environment mode based on response
      setMode(isLive ? Mode.LIVE : Mode.TEST);

      // Store auth state (user already has email from signupKey in response)
      setAuth({ ...user, email: user.signupKey }, token);

      // Show success feedback
      showToast?.({ message: t('Login successful'), type: 'success' });

      // Navigate to home
      router.replace(ROUTES.TABS.HOME);
    },

    onError: (error) => {
      console.error('[DeepLink] Authentication error:', error);

      // Show user-friendly error
      showToast?.({ message: getErrorMessage(error, t), type: 'danger' });

      // Redirect to login
      router.replace(ROUTES.AUTH.LOGIN);
    },
  });

  return {
    authenticateWithDeepLink: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
