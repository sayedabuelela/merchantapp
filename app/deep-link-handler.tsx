import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';
import * as Linking from 'expo-linking';
import DeepLinkView from '@/src/modules/auth/deep-link/deep-link.view';
import { DeepLinkParams } from '@/src/modules/auth/deep-link/deep-link.model';
import { ROUTES } from '@/src/core/navigation/routes';
import { useAuthStore, selectIsAuthenticated } from '@/src/modules/auth/auth.store';

type ParsingState = 'idle' | 'parsing' | 'success' | 'error';

/**
 * Parse deep link params from either router params or initial URL
 */
const parseDeepLinkParams = async (
  routerParams: Record<string, string | undefined>
): Promise<DeepLinkParams | null> => {
  const { accessToken, currentMerchantPayformanceId, refreshToken, v2 } = routerParams;

  // Try router params first (works in dev mode and most production cases)
  if (accessToken && currentMerchantPayformanceId) {
    return { accessToken, currentMerchantPayformanceId, refreshToken, v2 };
  }

  // For production builds, try initial URL as fallback
  try {
    const initialUrl = await Linking.getInitialURL();
    if (!initialUrl || initialUrl.includes('expo-development-client')) {
      return null;
    }

    const { queryParams } = Linking.parse(initialUrl);
    if (queryParams?.accessToken && queryParams?.currentMerchantPayformanceId) {
      return {
        accessToken: queryParams.accessToken as string,
        currentMerchantPayformanceId: queryParams.currentMerchantPayformanceId as string,
        refreshToken: queryParams.refreshToken as string | undefined,
        v2: queryParams.v2 as string | undefined,
      };
    }
  } catch (error) {
    console.error('[DeepLinkHandler] Error parsing initial URL:', error);
  }

  return null;
};

/**
 * Validates that required deep link params are present
 */
const isValidParams = (params: DeepLinkParams | null): params is DeepLinkParams => {
  return Boolean(params?.accessToken && params?.currentMerchantPayformanceId);
};

/**
 * Deep Link Handler Screen
 * Handles authentication via deep links from the web portal
 */
export default function DeepLinkHandler() {
  const routerParams = useLocalSearchParams();
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const [params, setParams] = useState<DeepLinkParams | null>(null);
  const [state, setState] = useState<ParsingState>('idle');
  const hasProcessed = useRef(false);

  // Extract stable values from router params
  const accessToken = routerParams.accessToken as string | undefined;
  const currentMerchantPayformanceId = routerParams.currentMerchantPayformanceId as string | undefined;
  const refreshToken = routerParams.refreshToken as string | undefined;
  const v2 = routerParams.v2 as string | undefined;

  // Parse params on mount
  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const initParams = async () => {
      setState('parsing');

      const parsedParams = await parseDeepLinkParams({
        accessToken,
        currentMerchantPayformanceId,
        refreshToken,
        v2,
      });

      if (isValidParams(parsedParams)) {
        console.log('[DeepLinkHandler] Valid params:', {
          hasAccessToken: true,
          hasMerchantId: true,
          v2: parsedParams.v2,
        });
        setParams(parsedParams);
        setState('success');
      } else {
        console.error('[DeepLinkHandler] Invalid or missing params');
        setState('error');
      }
    };

    initParams();
  }, [accessToken, currentMerchantPayformanceId, refreshToken, v2]);

  // Handle redirects
  // Handle redirects
  useEffect(() => {
    // Case 1: Already authenticated (but only if we haven't started a fresh login flow)
    // We check state === 'idle' to ensure we don't interfere with an active DeepLinkView flow
    if (isAuthenticated && state === 'idle') {
      console.log('[DeepLinkHandler] Already authenticated, redirecting to home');
      router.replace(ROUTES.TABS.HOME);
      return;
    }

    // Case 2: Parsing error or invalid params
    if (state === 'error') {
      console.log('[DeepLinkHandler] Invalid params, redirecting to login');
      router.replace(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, state, router]);

  // Loading or redirect states
  if (isAuthenticated || state !== 'success' || !params) {
    return null;
  }

  return <DeepLinkView params={params} />;
}
