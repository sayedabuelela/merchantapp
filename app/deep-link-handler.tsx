import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import DeepLinkView from '@/src/modules/auth/deep-link/deep-link.view';
import { DeepLinkParams } from '@/src/modules/auth/deep-link/deep-link.model';
import { ROUTES } from '@/src/core/navigation/routes';
import { useAuthStore, selectIsAuthenticated } from '@/src/modules/auth/auth.store';

export default function DeepLinkHandler() {
  const params = useLocalSearchParams<DeepLinkParams>();
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    // Edge case: User is already authenticated
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to home');
      router.replace(ROUTES.TABS.HOME);
      return;
    }

    // Validate required params - if missing, redirect to login
    if (!params.accessToken || !params.currentMerchantPayformanceId) {
      console.error('Invalid deep link params:', params);
      router.replace(ROUTES.AUTH.LOGIN);
      return;
    }
  }, [isAuthenticated, params, router]);

  // If already authenticated, don't render anything
  if (isAuthenticated) {
    return null;
  }

  // If params are missing, don't render (will redirect via useEffect)
  if (!params.accessToken || !params.currentMerchantPayformanceId) {
    return null;
  }

  return <DeepLinkView params={params} />;
}
