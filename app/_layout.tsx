import LanguageProvider from '@/src/core/providers/LanguageProvider';
import { NotificationProvider } from "@/src/core/providers/NotificationProvider";
import SplashProvider from "@/src/core/providers/SplashProvider";
import { selectAuthInitialize, selectIsAuthenticated, useAuthStore } from '@/src/modules/auth/auth.store';
import { useBiometricViewModel } from '@/src/modules/auth/biometric/biometric.viewmodel';
import '@/src/shared/localization/i18n';
// import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import "../global.css";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    }
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppContent() {
  // useAuthProtection();
  // useReactQueryDevTools(queryClient);
  const initializeAuth = useAuthStore(selectAuthInitialize);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { isBiometricAvailable, isInitialized: isBiometricInitialized } = useBiometricViewModel();

  if (!initializeAuth) {
    return null;
  }

  const canAccessEnableBiometricScreen = isAuthenticated && isBiometricAvailable && !isBiometricInitialized;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
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
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SplashProvider>
          <NotificationProvider>
            <KeyboardProvider>
              <AppContent />
            </KeyboardProvider>
          </NotificationProvider>
        </SplashProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

