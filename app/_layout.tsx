import LanguageProvider from '@/src/core/providers/LanguageProvider';
import NetworkProvider from '@/src/core/providers/NetworkProvider';
import { NotificationProvider } from "@/src/core/providers/NotificationProvider";
import SplashProvider from "@/src/core/providers/SplashProvider";
import { selectAuthInitialize, selectIsAuthenticated, useAuthStore } from '@/src/modules/auth/auth.store';
import { selectHasSeenOnboarding, useFirstOnboardingStore } from '@/src/modules/first-onboarding/first-onboarding.store';
import { useBiometricViewModel } from '@/src/modules/auth/biometric/biometric.viewmodel';
import '@/src/shared/localization/i18n';
// import { useReactQueryDevTools } from '@dev-plugins/react-query';
// import { ToastProvider } from '@/src/core/providers/ToastProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { Toaster } from 'sonner-native';
import "../global.css";
import { ToastProvider } from '@/src/core/providers/ToastProvider';
if (__DEV__) {
  require("../ReactotronConfig");
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    }
  }
});

// Track recently shown notifications to prevent duplicates
const recentNotifications = new Map<string, number>();
const DEDUP_WINDOW_MS = 5000; // 5 second window for deduplication

const getNotificationKey = (notification: Notifications.Notification): string => {
  const data = notification.request.content.data;
  // Create a unique key from notification content
  const originId = data?.originId || '';
  const orderId = data?.orderId || '';
  const transactionId = data?.transactionId || '';
  const title = notification.request.content.title || '';
  return `${originId}-${orderId}-${transactionId}-${title}`;
};

const cleanupOldNotifications = () => {
  const now = Date.now();
  for (const [key, timestamp] of recentNotifications.entries()) {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      recentNotifications.delete(key);
    }
  }
};

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Cleanup old entries
    cleanupOldNotifications();

    const key = getNotificationKey(notification);
    const now = Date.now();

    // Check if we've recently shown this notification
    if (recentNotifications.has(key)) {
      console.log('Skipping duplicate notification:', key);
      return {
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      };
    }

    // Track this notification
    recentNotifications.set(key, now);
    console.log('Showing notification:', key);

    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

function AppContent() {
  // useAuthProtection();
  // useReactQueryDevTools(queryClient);
  const initializeAuth = useAuthStore(selectAuthInitialize);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { isBiometricAvailable, isInitialized: isBiometricInitialized } = useBiometricViewModel();
  const hasSeenOnboarding = useFirstOnboardingStore(selectHasSeenOnboarding);

  if (!initializeAuth) {
    return null;
  }

  const canAccessEnableBiometricScreen = isAuthenticated && isBiometricAvailable && !isBiometricInitialized;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NetworkProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Protected guard={!hasSeenOnboarding && !isAuthenticated}>
            <Stack.Screen name="(first-onboarding)" />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={canAccessEnableBiometricScreen}>
            <Stack.Screen name="enable-biometric" />
          </Stack.Protected>

          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(profile)" />
          </Stack.Protected>
        </Stack>
        <Toaster toastOptions={{ style: { elevation: 9999, zIndex: 9999 } }} />
      </NetworkProvider>
    </GestureHandlerRootView>
  );
}
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SplashProvider>
          <NotificationProvider>
            <ToastProvider>
              <KeyboardProvider>
                <StatusBar style="dark" backgroundColor='#ffffff' />
                <AppContent />
              </KeyboardProvider>
            </ToastProvider>
          </NotificationProvider>
        </SplashProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

